import type { BetterAuthClientPlugin } from 'better-auth/client'
import { polarClient } from '@polar-sh/better-auth/client'
import { createAuthClient } from 'better-auth/client'
import { magicLinkClient } from 'better-auth/client/plugins'

export interface AppAuthClientOptions {
  baseURL: string
}

export function createAppAuthClient(options: AppAuthClientOptions) {
  // Typed as the base client plugin so the generated declarations do not
  // reference @polar-sh/better-auth's unexported plugin type.
  const polarClientPlugin: BetterAuthClientPlugin = polarClient()

  return createAuthClient({
    baseURL: options.baseURL,
    fetchOptions: {
      credentials: 'include',
    },
    plugins: [
      magicLinkClient(),
      polarClientPlugin,
    ],
  })
}

export type AppAuthClient = ReturnType<typeof createAppAuthClient>
