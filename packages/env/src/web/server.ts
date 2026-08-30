import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export function createWebServerEnv(
  runtimeEnv: Record<string, string | undefined>,
) {
  return createEnv({
    emptyStringAsUndefined: true,
    runtimeEnvStrict: {
      API_PROXY_TARGET: runtimeEnv.API_PROXY_TARGET,
      API_RPC_URL: runtimeEnv.API_RPC_URL,
    },
    server: {
      API_PROXY_TARGET: z.url().default('http://localhost:3001'),
      API_RPC_URL: z.url().default('http://localhost:3001/api/rpc'),
    },
  })
}
