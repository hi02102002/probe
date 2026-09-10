import type { MiddlewareHandler } from 'hono'
import { createORPCContext } from '#/orpc/context.js'
import { createOpenApiHandler } from '#/orpc/handlers.js'
import { router } from '#/orpc/routers/index.js'

const openApiHandler = createOpenApiHandler(router)

export const openApiMiddleware: MiddlewareHandler = async (c, next) => {
  const { matched, response } = await openApiHandler.handle(c.req.raw, {
    context: createORPCContext(),
    prefix: '/api',
  })

  if (matched) {
    return c.newResponse(response.body, response)
  }

  await next()
}

