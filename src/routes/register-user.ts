import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { hash } from "../lib/argon2.js";

export async function registerUser(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post('/user', {
    schema: {
      summary: 'Register an user',
      tags: ['user'],
      body: z.object({
        name: z.string().min(4),
        email: z.string().email(),
        password: z.string().min(6),
      }),
      response: {
        201: z.object({
          userId: z.string().uuid(),
        })
      }
    }
  } , async (request, reply) => {
    const { email, name, password } = request.body

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (userWithSameEmail !== null)
      throw new Error('Email is already being used.')

    const hashedPassword = await hash(password)

    if (hashedPassword === null)
      throw new Error('Could not hash password.')

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    return reply.status(201).send({ userId: user.id })
  })
}
