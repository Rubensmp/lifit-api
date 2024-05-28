import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "../lib/jwt.js";
import { BadRequest } from "../routes/_errors/bad-request.js";
import { JwtPayload } from 'jsonwebtoken';

// Declaração de módulo para estender a interface FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export async function isAuthenticated(request: FastifyRequest, reply: FastifyReply) {
  const rawToken = request.headers.authorization;
  const tokenParts = rawToken?.split('Bearer ');
  const accessToken = tokenParts?.[1];

  if (!accessToken) throw new BadRequest('Token not found.');

  const payload = await verify(accessToken);

  if (!payload) return reply.code(401).send({ error: 'Invalid token' });

  request.user = payload;
}
