import Fastify, { type FastifyError, type FastifyInstance } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { env } from "./env";
import { authPlugin } from "./plugins/auth";
import { swaggerPlugin } from "./plugins/swagger";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
        },
      },
    },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Validation error",
        issues: error.issues,
      });
    }

    if (error.validation) {
      return reply.status(400).send({
        message: "Validation error",
        issues: error.validation,
      });
    }

    const statusCode = error.statusCode ?? 500;
    if (statusCode >= 500) {
      app.log.error({ err: error }, "Internal server error");
    }

    return reply.status(statusCode).send({
      message:
        env.NODE_ENV === "production" ? "Internal server error" : error.message,
    });
  });

  //Plugins
  app.register(swaggerPlugin);
  app.register(authPlugin);

  //Health Check
  app.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
      },
    },
    async () => {
      return { status: "ok" };
    },
  );

  //Rotas
  app.register(authRoutes);
  app.register(usersRoutes);

  return app;
}
