import type { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
	app.decorateRequest('getCurrentUserId', async () => {
		return '';
	});

	app.addHook('preHandler', async (request, reply) => {
		request.getCurrentUserId = async () => {
			// 1) Verifica se o cookie/token existe
			const rawToken = request.cookies?.token;

			if (!rawToken || typeof rawToken !== 'string' || rawToken.trim() === '') {
				reply.clearCookie('token');
				return reply.status(401).send({ message: 'Token not provided' });
			}

			// 2) Verifica formato básico de JWT (header.payload.signature)
			if (rawToken.split('.').length !== 3) {
				reply.clearCookie('token');
				return reply.status(401).send({ message: 'Malformed token' });
			}

			try {
				// 3) Verifica assinatura + decodifica payload
				const payload = await request.jwtVerify<{ sub?: string; exp?: number; iat?: number }>();

				// 4) Valida claim `sub`
				if (!payload?.sub || typeof payload.sub !== 'string') {
					reply.clearCookie('token');
					return reply.status(401).send({ message: 'Invalid token payload' });
				}

				// 5) Valida expiração explicitamente (defesa em profundidade)
				if (payload.exp && Date.now() >= payload.exp * 1000) {
					reply.clearCookie('token');
					return reply.status(401).send({ message: 'Token expired' });
				}

				return payload.sub;
			} catch (error) {
				request.log.warn({ err: error }, 'Token verification failed');
				reply.clearCookie('token');
				return reply.status(401).send({ message: 'Invalid token' });
			}
		};
	});
});
