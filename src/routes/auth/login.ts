import { compare } from "bcryptjs";
import z from "zod";
import type { FastifyTypedInstance } from "../../@types/fastify-typed";
import { env } from "../../env";
import { prisma } from "../../lib/prisma";
import {
  ACCESS_COOKIE,
  accessCookieOptions,
  REFRESH_COOKIE,
  refreshCookieOptions,
} from "../../plugins/auth";

export default async function Login(app: FastifyTypedInstance) {
  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["Auth"],
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
        return reply.status(400).send({ message: "Invalid email or password" });
      }

      const passwordCompare = await compare(password, userExists.password);

      if (!passwordCompare) {
        return reply.status(400).send({ message: "Invalid email or password" });
      }

      const accessToken = await reply.jwtSign(
        { sub: userExists.id, role: userExists.role },
        { expiresIn: env.JWT_ACCESS_EXPIRATION_IN },
      );

      const refreshToken = await reply.jwtSign(
        { sub: userExists.id, role: userExists.role },
        { expiresIn: env.JWT_REFRESH_EXPIRATION_IN },
      );

      reply
        .setCookie(ACCESS_COOKIE, accessToken, accessCookieOptions)
        .setCookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);

      return reply.status(200).send(null);
    },
  );
}
