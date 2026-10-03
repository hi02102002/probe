import process from 'node:process'
import { createWebServerEnv } from '@repo/env/web/server'

export { createWebServerEnv } from '@repo/env/web/server'

export const env = createWebServerEnv({
  API_RPC_URL: process.env.API_RPC_URL,
  API_URL: process.env.API_URL,
  POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
  POLAR_PREMIUM_PRODUCT_ID: process.env.POLAR_PREMIUM_PRODUCT_ID,
  SERVER_URL: process.env.SERVER_URL,
  WEB_URL: process.env.WEB_URL,
})
