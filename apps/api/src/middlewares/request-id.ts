import type { MiddlewareHandler } from 'hono'
import { requestId } from 'hono/request-id'

export const requestIdMiddleware = requestId()

export const syncRequestIdHeaderMiddleware: MiddlewareHandler = async (c, next) => {
  const id = c.get('requestId')
  if (id) {
    c.req.raw.headers.set('x-request-id', id)
  }
  await next()
}
