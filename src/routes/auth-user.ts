import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { hash, verify } from "../lib/argon2.js";
import { sign } from "../lib/jwt.js";

export async function authUser(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post('/auth', {
    schema: {
      summary: 'Auth an user',
      tags: ['user'],
      body: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
      response: {
        200: z.object({
          acessToken: z.string(),
        })
      }
    }
  } , async (request, reply) => {
    const { email, password } = request.body

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (user === null)
      throw new Error('Invalid credentials.')

    const isValidPassword = await verify(user.password, password)

    if (!isValidPassword)
      throw new Error('Invalid credentials.')

    const acessToken = await sign({
      id: user.id
    })

    return reply.status(201).send({ acessToken })
  })
}
