import process from 'node:process'
import { createWebServerEnv } from '@repo/env/web/server'

export { createWebServerEnv } from '@repo/env/web/server'

export const env = createWebServerEnv({
  API_RPC_URL: process.env.API_RPC_URL,
  API_URL: process.env.API_URL,
  SERVER_URL: process.env.SERVER_URL,
  WEB_URL: process.env.WEB_URL,
})
