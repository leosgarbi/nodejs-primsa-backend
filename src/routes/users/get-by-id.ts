import { z } from "zod";
import type { FastifyTypedInstance } from "../../@types/fastify-typed";
import { Role } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export default async function GetUserById(app: FastifyTypedInstance) {
  app.get(
    "/user/:id",
    {
      schema: {
        tags: ["Users"],
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
        return reply.status(400).send({ message: "Error fetching user" });
      }

      reply.status(200).send(user);
    },
  );
}
