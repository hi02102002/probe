import type { EvlogVariables } from 'evlog/hono'
import { Hono } from 'hono'
import { getAuth } from '#/auth.js'
import {
  corsMiddleware,
  enrichLoggerMiddleware,
  evlogMiddleware,
  openApiMiddleware,
  orpcMiddleware,
  requestIdMiddleware,
  secureHeadersMiddleware,
  syncRequestIdHeaderMiddleware,
} from '#/middlewares/index.js'

export function createApp() {
  const app = new Hono<EvlogVariables>().basePath('/api')

  app.use('*', corsMiddleware)
  app.use('*', requestIdMiddleware)
  app.use('*', syncRequestIdHeaderMiddleware)
  app.use('*', evlogMiddleware)
  app.use('*', enrichLoggerMiddleware)
  app.use('*', secureHeadersMiddleware)

  app.all('/auth/*', c => getAuth().handler(c.req.raw))

  app.use('/rpc/*', orpcMiddleware)
  app.use('/*', openApiMiddleware)

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
