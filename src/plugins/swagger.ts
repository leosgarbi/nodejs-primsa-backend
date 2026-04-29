import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyPlugin from "fastify-plugin";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { ACCESS_COOKIE } from "./auth";

export const swaggerPlugin = fastifyPlugin(async (app) => {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Aula Backend",
        description: "Uma API para aula de backend",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            name: ACCESS_COOKIE,
            in: "cookie",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
  });
});
