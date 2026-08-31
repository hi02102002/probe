import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export function createWebServerEnv(
  runtimeEnv: Record<string, string | undefined>,
) {
  const serverUrl = runtimeEnv.API_URL || runtimeEnv.SERVER_URL || 'http://localhost:3001'
  const rpcUrl = runtimeEnv.API_RPC_URL || (serverUrl ? `${serverUrl.replace(/\/+$/, '')}/api/rpc` : undefined)

  return createEnv({
    emptyStringAsUndefined: true,
    runtimeEnvStrict: {
      API_URL: runtimeEnv.API_URL || runtimeEnv.SERVER_URL,
      API_RPC_URL: rpcUrl,
    },
    server: {
      API_URL: z.url().default('http://localhost:3001'),
      API_RPC_URL: z.url().default('http://localhost:3001/api/rpc'),
    },
  })
}
