import { createWebClientEnv } from '@repo/env/web/client'

export const env = createWebClientEnv({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
})
