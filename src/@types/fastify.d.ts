import "fastify";
import type { JwtPayload } from "../plugins/auth";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}
