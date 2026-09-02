import { createAppAuthClient } from '@repo/auth/client'
import { env } from '@/env/client'

let authClient: ReturnType<typeof createAppAuthClient> | undefined

export function getAuthClient() {
  if (authClient) {
    return authClient
  }

  authClient = createAppAuthClient({
    baseURL: env.VITE_API_URL,
  })

  return authClient
}
