import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { BadRequest } from "./_errors/bad-request.js";
import { isAuthenticated } from "../utils/isAuthenticathed.js";

export async function getUserInfo(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().get('/profile', {
    preHandler: isAuthenticated,
    schema: {
      summary: 'Get user infomations',
      tags: ['user'],
      response: {
        200: z.object({
          user: z.object({
            id: z.string().uuid(),
            name: z.string(),
            email: z.string().email(),
            createdAt: z.date()
          })
        })
      },
    }
  } , async (request, reply) => {

    const userr = request.user

    if(!userr) throw new BadRequest('User not authenticated')


    const user = await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      where: {
        id: userr.id
      },
    })

    if(!user) throw new BadRequest('User not found')

    return reply.send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }
    })
  })
}
