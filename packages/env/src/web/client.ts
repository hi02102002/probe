import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export function createWebClientEnv(
  runtimeEnv: Record<string, string | undefined>,
) {
  return createEnv({
    client: {
      VITE_SITE_URL: z.url().default('http://localhost:3000'),
      VITE_API_PROXY_TARGET: z.string().default('http://localhost:3001'),
    },
    clientPrefix: 'VITE_',
    emptyStringAsUndefined: true,
    runtimeEnvStrict: {
      VITE_SITE_URL: runtimeEnv.VITE_SITE_URL,
      VITE_API_PROXY_TARGET: runtimeEnv.VITE_API_PROXY_TARGET,
    },
  })
}
