import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { auth } from '../../middleware/auth';
import { Role } from '../../generated/prisma/client';

export async function GetUsers(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			'/users',
			{
				schema: {
					tags: ['Users'],
					response: {
						200: z.array(
							z.object({
								id: z.string(),
								name: z.string(),
								email: z.email(),
								role: z.enum(Role),
								createdAt: z.date(),
								updatedAt: z.date(),
							}),
						),
						400: z.object({
							message: z.string(),
						}),
						401: z.object({
							message: z.string(),
						}),
					},
					security: [{ cookieAuth: [] }],
				},
			},
			async (request, reply) => {
				const userId = await request.getCurrentUserId();

				if (!userId) {
					return reply.status(401).send({ message: 'Unauthorized' });
				}

				const users = await prisma.user.findMany();

				if (!users) {
					return reply.status(400).send({ message: 'Error fetching users' });
				}

				reply.status(200).send(users);
			},
		);
}
