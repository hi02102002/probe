import type { EvlogVariables } from 'evlog/hono'
import type { MiddlewareHandler } from 'hono'
import { createAppEnricher } from '@repo/utils'
import { evlog } from 'evlog/hono'
import { enrichLogger, getAuthIdentifier } from '#/libs/evlog.js'

/**
 * Paths that never produce evlog events at the Hono layer. The oRPC
 * `withEvlog` wrapper must NOT use this list — excluding a path there skips
 * evlog's async storage init, which makes `useLogger()` inside handlers
 * throw. Hono-level exclusion here already prevents duplicate events.
 */
export const EVLOG_EXCLUDED_PATHS = [
  '/',
  '/api',
  '/api/',
  '/spec.json',
  '/api/spec.json',
  '/health',
  '/api/health',
  '/api/health/*',
  '/openapi/**',
  '/api/openapi/**',
  '/rpc/**',
  '/api/rpc/**',
]

export const evlogMiddleware = evlog({
  exclude: EVLOG_EXCLUDED_PATHS,
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
