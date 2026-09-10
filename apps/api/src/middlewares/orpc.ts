import type { MiddlewareHandler } from 'hono'
import { createORPCContext } from '#/orpc/context.js'
import { createRpcHandler } from '#/orpc/handlers.js'
import { router } from '#/orpc/routers/index.js'

const rpcHandler = createRpcHandler(router)

export const orpcMiddleware: MiddlewareHandler = async (c, next) => {
  const { matched, response } = await rpcHandler.handle(c.req.raw, {
    context: createORPCContext(),
    prefix: '/api/rpc',
  })

  if (matched) {
    return c.newResponse(response.body, response)
  }

  await next()
}
