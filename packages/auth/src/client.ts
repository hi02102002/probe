import { createAuthClient } from 'better-auth/client'
import { magicLinkClient } from 'better-auth/client/plugins'

export interface AppAuthClientOptions {
  baseURL: string
}

export function createAppAuthClient(options: AppAuthClientOptions) {
  return createAuthClient({
    baseURL: options.baseURL,
    fetchOptions: {
      credentials: 'include',
    },
    plugins: [
      magicLinkClient(),
    ],
  })
}

export type AppAuthClient = ReturnType<typeof createAppAuthClient>
