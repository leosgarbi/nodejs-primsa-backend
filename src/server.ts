import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { CreateUser } from './routes/users/create-user';
import { GetUsers } from './routes/users/get-users';
import { GetUserById } from './routes/users/get-by-id';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import { Login } from './routes/auth/login';
import { Me } from './routes/auth/me';

const app = Fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Aula Backend',
			description: 'Uma API para aula de backend',
			version: '1.0.0',
		},
		components: {
			securitySchemes: {
				cookieAuth: {
					type: 'apiKey',
					name: 'token',
					in: 'cookie',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
	routePrefix: '/docs',
});

app.register(fastifyCookie);
app.register(fastifyJwt, {
	secret: 'supersecret',
	cookie: {
		cookieName: 'token',
		signed: false,
	},
});
//Registro das rotas
app.register(CreateUser);
app.register(GetUsers);
app.register(GetUserById);

app.register(Login);
app.register(Me);

app.listen({ port: 3333 }).then(() => {
	console.log('Servidor iniciado 🚀, porta 3333');
});
