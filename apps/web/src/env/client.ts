import { createWebClientEnv } from '@repo/env/web/client'

export const env = createWebClientEnv({
  SERVER_URL: import.meta.env.SERVER_URL,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
  WEB_URL: import.meta.env.WEB_URL,
})
