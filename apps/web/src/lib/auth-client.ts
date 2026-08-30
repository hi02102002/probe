import { createAppAuthClient } from '@repo/auth/client'

let authClient: ReturnType<typeof createAppAuthClient> | undefined

export function getAuthClient() {
  if (authClient) {
    return authClient
  }

  authClient = createAppAuthClient({
    baseURL: typeof window === 'undefined' ? '' : window.location.origin,
  })

  return authClient
}
