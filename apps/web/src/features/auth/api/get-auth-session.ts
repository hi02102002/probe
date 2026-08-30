import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { env } from '@/env/server'
import { getAuthClient } from '@/lib/auth-client'

export interface AuthSession {
  session: {
    id: string
    userId: string
  }
  user: {
    email: string
    id: string
    image?: null | string
    name: string
  }
}

export const getAuthSession = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthSession | null> => {
    try {
      const authBaseURL = new URL('/api/auth', env.API_PROXY_TARGET).toString()
      const { data, error } = await getAuthClient().getSession({
        fetchOptions: {
          baseURL: authBaseURL,
          headers: getRequestHeaders(),
        },
      })

      if (error) {
        throw new Error(error.message ?? 'Failed to fetch auth session')
      }

      return data as AuthSession | null
    }
    catch {
      return null
    }
  },
)

export const getAuthSessionQueryOptions = queryOptions({
  queryKey: ['auth-session'],
  queryFn: getAuthSession,
})
