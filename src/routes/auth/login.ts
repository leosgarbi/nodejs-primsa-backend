import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../../lib/prisma';
import { compare } from 'bcryptjs';

export async function Login(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/auth/login',
		{
			schema: {
				tags: ['Auth'],
				body: z.object({
					email: z.email(),
					password: z.string().min(6),
				}),
				response: {
					200: z.null(),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const userExists = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!userExists) {
				return reply.status(400).send({ message: 'Invalid email or password' });
			}

			const passwordCompare = await compare(password, userExists.password);

			if (!passwordCompare) {
				return reply.status(400).send({ message: 'Invalid email or password' });
			}

			const token = app.jwt.sign({ sub: userExists.id, role: userExists.role });

			reply.setCookie('token', token, {
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				path: '/',
				maxAge: 60,
			});

			return reply.status(200).send(null);
		},
	);
}
