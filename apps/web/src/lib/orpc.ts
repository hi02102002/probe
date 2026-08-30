import type { ContractRouterClient } from '@orpc/contract'
import type { TanstackQueryOperationContext } from '@orpc/tanstack-query'
import type { contract } from '@repo/api-contracts'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { DedupeRequestsPlugin } from '@orpc/client/plugins'
import { toStandardHeaders } from '@orpc/client/standard'
import {
  createTanstackQueryUtils,
  TANSTACK_QUERY_OPERATION_CONTEXT_SYMBOL,
} from '@orpc/tanstack-query'
import { resolveHttpUrl } from '@repo/utils'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { env as clientEnv } from '@/env/client'
import { env as serverEnv } from '@/env/server'

const GET_OPERATION_TYPES = new Set([
  'query',
  'streamed',
  'live',
  'infinite',
])

export interface ApiClientContext extends TanstackQueryOperationContext {}

export const createApiClient = createIsomorphicFn().client((url: string | URL) => {
  const link = new RPCLink<ApiClientContext>({
    fetch: (input, init) => fetch(input, { ...init, credentials: 'include' }),
    method: ({ context }) => {
      const operationType
        = context[TANSTACK_QUERY_OPERATION_CONTEXT_SYMBOL]?.type

      return operationType && GET_OPERATION_TYPES.has(operationType)
        ? 'GET'
        : 'POST'
    },
    plugins: [
      new DedupeRequestsPlugin({
        groups: [
          {
            condition: () => true,
            context: {},
          },
        ],
      }),
    ],
    url,
  })

  return createORPCClient<
    ContractRouterClient<typeof contract, ApiClientContext>
  >(link)
}).server((url) => {
  const headers = getRequestHeaders()
  const link = new RPCLink<ApiClientContext>({
    plugins: [
      new DedupeRequestsPlugin({
        groups: [
          {
            condition: () => true,
            context: {},
          },
        ],
      }),
    ],
    url,
    headers: () => toStandardHeaders(headers),
  })

  return createORPCClient<
    ContractRouterClient<typeof contract, ApiClientContext>
  >(link)
})

export function createApiQueryUtils(url: string | URL) {
  return createTanstackQueryUtils(createApiClient(url))
}

export const getApiRpcUrl = createIsomorphicFn()
  .client(() => new URL('/api/rpc', clientEnv.VITE_API_URL))
  .server(() =>
    resolveHttpUrl(
      serverEnv.API_RPC_URL,
      'http://localhost:3001/api/rpc',
    ),
  )
