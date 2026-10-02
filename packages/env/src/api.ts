import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export function createApiEnv(
  runtimeEnv: Record<string, string | undefined>,
) {
  const serverUrl = runtimeEnv.SERVER_URL || 'http://localhost:3001'

  return createEnv({
    emptyStringAsUndefined: true,
    runtimeEnvStrict: {
      APP_NAME: runtimeEnv.APP_NAME,
      AUTH_COOKIE_DOMAIN: runtimeEnv.AUTH_COOKIE_DOMAIN,
      BETTER_AUTH_SECRET: runtimeEnv.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: runtimeEnv.BETTER_AUTH_URL || serverUrl,
      DATABASE_URL: runtimeEnv.DATABASE_URL,
      GITHUB_CLIENT_ID: runtimeEnv.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: runtimeEnv.GITHUB_CLIENT_SECRET,
      GOOGLE_CLIENT_ID: runtimeEnv.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: runtimeEnv.GOOGLE_CLIENT_SECRET,
      PORT: runtimeEnv.PORT,
      POLAR_ACCESS_TOKEN: runtimeEnv.POLAR_ACCESS_TOKEN,
      POLAR_PREMIUM_PRODUCT_ID: runtimeEnv.POLAR_PREMIUM_PRODUCT_ID,
      POLAR_SERVER: runtimeEnv.POLAR_SERVER,
      POLAR_WEBHOOK_SECRET: runtimeEnv.POLAR_WEBHOOK_SECRET,
      RESEND_API_KEY: runtimeEnv.RESEND_API_KEY,
      RESEND_FROM_EMAIL: runtimeEnv.RESEND_FROM_EMAIL,
      RETENTION_DAYS: runtimeEnv.RETENTION_DAYS,
      SERVER_URL: serverUrl,
      WEB_URL: runtimeEnv.WEB_URL,
      REDIS_URL: runtimeEnv.REDIS_URL,
    },
    server: {
      APP_NAME: z.string().min(1).default('Probe'),
      AUTH_COOKIE_DOMAIN: z.string().min(1).optional(),
      BETTER_AUTH_SECRET: z.string().min(32),
      BETTER_AUTH_URL: z.url().default('http://localhost:3001'),
      DATABASE_URL: z.string().min(1),
      GITHUB_CLIENT_ID: z.string().min(1).optional(),
      GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
      GOOGLE_CLIENT_ID: z.string().min(1).optional(),
      GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
      PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
      POLAR_ACCESS_TOKEN: z.string().min(1).optional(),
      POLAR_PREMIUM_PRODUCT_ID: z.string().min(1).optional(),
      POLAR_SERVER: z.enum(['sandbox', 'production']).default('sandbox'),
      POLAR_WEBHOOK_SECRET: z.string().min(1).optional(),
      RESEND_API_KEY: z.string().min(1).optional(),
      RESEND_FROM_EMAIL: z.email().optional(),
      RETENTION_DAYS: z.coerce.number().int().min(0).max(3650).default(30),
      SERVER_URL: z.url().default('http://localhost:3001'),
      WEB_URL: z.string()
        .default('http://localhost:3000')
        .transform(value => value.split(',').map(origin => origin.trim()).filter(Boolean))
        .pipe(z.array(z.url()).min(1)),
      REDIS_URL: z.string().min(1),
    },
  })
}
