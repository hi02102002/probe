import type { EvlogVariables } from 'evlog/hono'
import type { MiddlewareHandler } from 'hono'
import { createAppEnricher } from '@repo/utils'
import { evlog } from 'evlog/hono'
import { enrichLogger, getAuthIdentifier } from '#/libs/evlog.js'

export const evlogMiddleware = evlog({
  exclude: [
    '/',
    '/api',
    '/api/',
    '/spec.json',
    '/api/spec.json',
    '/health',
    '/api/health',
    '/openapi/**',
    '/api/openapi/**',
    '/rpc/**',
    '/api/rpc/**',
  ],
  redact: true,
  enrich: createAppEnricher(),
})

export const enrichLoggerMiddleware: MiddlewareHandler<EvlogVariables> = async (c, next) => {
  const log = c.get('log')

  if (log) {
    await getAuthIdentifier()(log, c.req.raw.headers, c.req.path)
    await enrichLogger(log, c.req.raw.headers)
  }

  await next()
}
