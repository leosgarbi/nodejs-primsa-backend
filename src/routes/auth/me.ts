import z from "zod";
import type { FastifyTypedInstance } from "../../@types/fastify-typed";
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export default async function Me(app: FastifyTypedInstance) {
  app.get("/auth/me", {
    onRequest: [app.authenticate],
    schema: {
      tags: ["Auth"],
      security: [{ cookieAuth: [] }],
      response: {
        200: z.object({
          id: z.string(),
          name: z.string(),
          email: z.email(),
          role: z.enum(Role),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
        404: z.object({
          message: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { sub } = request.user;

      const user = await prisma.user.findUnique({
        where: { id: sub },
      });

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      reply.send(user);
    },
  });
}
