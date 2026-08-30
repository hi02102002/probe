import { createWebClientEnv } from '@repo/env/web/client'

export const env = createWebClientEnv({
  VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
  VITE_API_PROXY_TARGET: import.meta.env.VITE_API_PROXY_TARGET,
})
