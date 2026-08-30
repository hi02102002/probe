import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export function createWebClientEnv(
  runtimeEnv: Record<string, string | undefined>,
) {
  return createEnv({
    client: {
      VITE_API_URL: z.url().default('http://localhost:3001'),
      VITE_SITE_URL: z.url().default('http://localhost:3000'),
    },
    clientPrefix: 'VITE_',
    emptyStringAsUndefined: true,
    runtimeEnvStrict: {
      VITE_API_URL: runtimeEnv.VITE_API_URL,
      VITE_SITE_URL: runtimeEnv.VITE_SITE_URL,
    },
  })
}
