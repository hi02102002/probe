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
      BETTER_AUTH_SECRET: runtimeEnv.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: runtimeEnv.BETTER_AUTH_URL || serverUrl,
      DATABASE_URL: runtimeEnv.DATABASE_URL,
      GITHUB_CLIENT_ID: runtimeEnv.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: runtimeEnv.GITHUB_CLIENT_SECRET,
      GOOGLE_CLIENT_ID: runtimeEnv.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: runtimeEnv.GOOGLE_CLIENT_SECRET,
      PORT: runtimeEnv.PORT,
      RESEND_API_KEY: runtimeEnv.RESEND_API_KEY,
      RESEND_FROM_EMAIL: runtimeEnv.RESEND_FROM_EMAIL,
      SERVER_URL: serverUrl,
      WEB_URL: runtimeEnv.WEB_URL,
    },
    server: {
      APP_NAME: z.string().min(1).default('Probe'),
      BETTER_AUTH_SECRET: z.string().min(32),
      BETTER_AUTH_URL: z.url().default('http://localhost:3001'),
      DATABASE_URL: z.string().min(1),
      GITHUB_CLIENT_ID: z.string().min(1).optional(),
      GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
      GOOGLE_CLIENT_ID: z.string().min(1).optional(),
      GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
      PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
      RESEND_API_KEY: z.string().min(1).optional(),
      RESEND_FROM_EMAIL: z.email().optional(),
      SERVER_URL: z.url().default('http://localhost:3001'),
      WEB_URL: z.string()
        .default('http://localhost:3000')
        .transform(value => value.split(',').map(origin => origin.trim()).filter(Boolean))
        .pipe(z.array(z.url()).min(1)),
    },
  })
}
