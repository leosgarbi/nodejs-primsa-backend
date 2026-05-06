import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { Role } from '../../generated/prisma/client';

export async function GetUserById(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/user/:id',
		{
			schema: {
				tags: ['Users'],
				params: z.object({
					id: z.string(),
				}),
				response: {
					200: z.object({
						id: z.string(),
						name: z.string(),
						email: z.email(),
						role: z.enum(Role),
						createdAt: z.date(),
						updatedAt: z.date(),
					}),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params;

			const user = await prisma.user.findUnique({
				where: { id },
			});

			if (!user) {
				return reply.status(400).send({ message: 'Error fetching user' });
			}

			reply.status(200).send(user);
		},
	);
}
