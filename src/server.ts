import fastify from "fastify";

import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUI from "@fastify/swagger-ui"
import { fastifyCors } from "@fastify/cors";

import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import { registerUser } from "./routes/register-user.js";
import { authUser } from "./routes/auth-user.js";
import { getUserInfo } from "./routes/get-user-info.js";


const app = fastify()

app.register(fastifyCors, {
  // http://meufrontend.com
  origin: '*',
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: "lift.it",
      description: "Especificações da API para o back-end da aplicação lift.it",
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs'
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(registerUser)
app.register(authUser)
app.register(getUserInfo)


app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running.')
})
