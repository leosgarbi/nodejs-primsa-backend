import { z } from "zod";
import type { FastifyTypedInstance } from "../../@types/fastify-typed";
import { Role } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export default async function GetUsers(app: FastifyTypedInstance) {
  app.get(
    "/users",
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ["Users"],
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
          403: z.object({
            message: z.string(),
          }),
        },
        security: [{ cookieAuth: [] }],
      },
    },
    async (request, reply) => {
      if (request.user.role !== "ADMIN") {
        return reply.status(403).send({ message: "Forbidden" });
      }

      const users = await prisma.user.findMany();

      reply.status(200).send(users);
    },
  );
}
