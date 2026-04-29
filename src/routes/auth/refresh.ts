import z from "zod";
import type { FastifyTypedInstance } from "../../@types/fastify-typed";
import {
  ACCESS_COOKIE,
  accessCookieOptions,
  REFRESH_COOKIE,
  refreshCookieOptions,
  type JwtPayload,
} from "../../plugins/auth";

export default async function Refresh(app: FastifyTypedInstance) {
  app.post(
    "/auth/refresh",
    {
      schema: {
        tags: ["Auth"],
        response: {
          200: z.null(),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const signed = request.cookies[REFRESH_COOKIE];
      if (!signed) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const unsigned = reply.unsignCookie(signed);
      if (!unsigned.valid || !unsigned.value) {
        reply.clearCookie(REFRESH_COOKIE, { path: refreshCookieOptions.path });

        return reply.status(401).send({ message: "Unauthorized" });
      }

      let payload: JwtPayload;

      try {
        payload = app.jwt.verify<JwtPayload>(unsigned.value);
      } catch (err) {
        request.log.warn({ err }, "Invalid refresh token");
        reply.clearCookie(REFRESH_COOKIE, { path: refreshCookieOptions.path });
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const accessToken = await reply.jwtSign(
        { sub: payload.sub, role: payload.role },
        { expiresIn: app.jwt.options.sign?.expiresIn },
      );

      const refreshToken = await reply.jwtSign(
        { sub: payload.sub, role: payload.role },
        { expiresIn: app.jwt.options.sign?.expiresIn },
      );

      reply
        .setCookie(ACCESS_COOKIE, accessToken, accessCookieOptions)
        .setCookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);

      return reply.status(200).send(null);
    },
  );
}
