import { fastifyCookie, type CookieSerializeOptions } from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastifyPlugin from "fastify-plugin";
import { env } from "../env";

export type JwtPayload = {
  sub: string;
  role: string;
};

export const ACCESS_COOKIE = "aceess_token";
export const REFRESH_COOKIE = "refresh_token";

export const accessCookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  signed: true,
  path: "/",
  maxAge: env.COOKIE_ACCESS_MAX_AGE,
};

export const refreshCookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  signed: true,
  path: "/auth",
  maxAge: env.COOKIE_REFRESH_MAX_AGE,
};

export const authPlugin = fastifyPlugin(async (app) => {
  app.register(fastifyCookie, {
    secret: env.COOKIE_SECRET,
  });

  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: ACCESS_COOKIE,
      signed: true,
    },
    sign: {
      expiresIn: env.JWT_ACCESS_EXPIRATION_IN,
    },
  });

  app.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      request.log.warn({ err }, "Authentication failed");
      reply.clearCookie(ACCESS_COOKIE);
      return reply.status(401).send({ message: "Unauthorized" });
    }
  });
});
