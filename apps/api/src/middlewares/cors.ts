import { cors } from 'hono/cors'
import { env } from '#/env.js'

export const corsMiddleware = cors({
  origin: origin => env.WEB_URL.includes(origin) ? origin : env.WEB_URL[0],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: [
    'Content-Type',
    'Authorization',
    'x-request-id',
    'x-orpc-source',
    'cookie',
    'baggage',
    'sentry-trace',
  ],
  exposeHeaders: ['Content-Length', 'x-request-id', 'set-cookie'],
  credentials: true,
})
