import type { AuthSession } from '@/features/auth/api/get-auth-session'
import { StandardRPCJsonSerializer } from '@orpc/client/standard'
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query'
import { createApiQueryUtils, getApiRpcUrl } from '@/lib/orpc'

const serializer = new StandardRPCJsonSerializer()

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: {
        serializeData(data) {
          const [json, meta] = serializer.serialize(data)

          return { json, meta }
        },
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query)
          || query.state.status === 'pending',
      },
      hydrate: {
        deserializeData(data) {
          return serializer.deserialize(data.json, data.meta)
        },
      },
      queries: {
        queryKeyHashFn(queryKey) {
          const [json, meta] = serializer.serialize(queryKey)

          return JSON.stringify({ json, meta })
        },
        staleTime: 60 * 1000,
      },
    },
  })
  const orpc = createApiQueryUtils(getApiRpcUrl())

  return {
    orpc,
    queryClient,
    session: null as AuthSession | null,
  }
}

export type RouterContext = ReturnType<typeof getContext>

export default function TanstackQueryProvider() {}
