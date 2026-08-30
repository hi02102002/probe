import process from 'node:process'

import { createWebServerEnv } from '@repo/env/web/server'

export { createWebServerEnv } from '@repo/env/web/server'

export const env = createWebServerEnv({
  API_PROXY_TARGET: process.env.API_PROXY_TARGET,
  API_RPC_URL: process.env.API_RPC_URL,
})
