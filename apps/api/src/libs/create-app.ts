import type { EvlogVariables } from 'evlog/hono'
import { evlog } from 'evlog/hono'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'
import { getAuth } from '#/auth.js'
import { env } from '#/env.js'
import { getAuthIdentifier } from '#/libs/evlog.js'
import { createORPCContext } from '#/libs/orpc/context.js'
import { createRpcHandler } from '#/libs/orpc/handlers.js'
import { router } from '#/routers/index.js'

export function createApp() {
  const app = new Hono<EvlogVariables>().basePath('/api')

  app.use('*', cors({
    origin: origin => env.WEB_URL.includes(origin) ? origin : env.WEB_URL[0],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'x-orpc-source', 'cookie', 'baggage', 'sentry-trace'],
    exposeHeaders: ['Content-Length', 'x-request-id', 'set-cookie'],
    credentials: true,
  }))
  app.use('*', requestId())
  app.use('*', async (c, next) => {
    c.req.raw.headers.set('x-request-id', c.get('requestId'))
    await next()
  })
  app.use('*', evlog({
    exclude: [
      '/health',
      '/api/health',
      '/openapi/**',
      '/api/openapi/**',
      '/rpc/**',
      '/api/rpc/**',
    ],
    redact: true,
  }))
  app.use('*', async (c, next) => {
    const log = c.get('log')

    if (log) {
      await getAuthIdentifier()(log, c.req.raw.headers, c.req.path)
    }

    await next()
  })
  app.use('*', secureHeaders())

  app.get('/health', c => c.json({
    service: 'probe-api',
    status: 'ok',
  }))

  app.all('/auth/*', c => getAuth().handler(c.req.raw))

  const rpcHandler = createRpcHandler(router)

  app.use('/rpc/*', async (c, next) => {
    const { matched, response } = await rpcHandler.handle(c.req.raw, {
      context: createORPCContext(),
      prefix: '/api/rpc',
    })

    if (matched) {
      return c.newResponse(response.body, response)
    }

    await next()
  })

  app.notFound(c => c.json({
    error: 'Not found',
  }, 404))

  app.onError((error, c) => {
    c.get('log')?.error(error)

    return c.json({
      error: 'Internal server error',
    }, 500)
  })

  return app
}
