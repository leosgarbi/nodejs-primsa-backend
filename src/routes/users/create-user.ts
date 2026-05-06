import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function CreateUser(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/user',
		{
			schema: {
				tags: ['Users'],
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string().min(6),
				}),
				response: {
					201: z.object({
						message: z.string(),
					}),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { name, email, password } = request.body;

			const userExists = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (userExists) {
				return reply.status(400).send({ message: 'User already exists' });
			}

			const passwordHash = await bcrypt.hash(password, 10);

			const user = await prisma.user.create({
				data: {
					name,
					email,
					password: passwordHash,
				},
			});

			if (!user) {
				return reply.status(400).send({ message: 'Error creating user' });
			}

			reply.status(201).send({ message: 'User created successfully' });
		},
	);
}
