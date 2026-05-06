import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../middleware/auth';

export async function Me(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get('/me', {
			schema: {
				tags: ['Auth'],
				security: [{ cookieAuth: [] }],
			},
			handler: async (request, reply) => {
				const userId = await request.getCurrentUserId();
				return { userId };
			},
		});
}
