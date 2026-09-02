import { createFileRoute } from '@tanstack/react-router'
import { EndpointsPage } from '@/features/endpoints'
import { endpointSearchSchema } from '@/features/endpoints/search-params'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints',
)({
  validateSearch: endpointSearchSchema,
  loaderDeps: ({ search }) => search,
  context: ({ context, deps }) => {
    const sort = deps.sortBy
      ? {
          by: deps.sortBy,
          order: deps.sortOrder ?? 'asc',
        }
      : undefined

    const endpointsQueryOptions = context.orpc.endpoint.list.queryOptions({
      input: {
        query: {
          sort,
          status: deps.status ?? undefined,
          pagination: {
            page: deps.page ?? 1,
            limit: deps.limit ?? 10,
          },
          query: deps.query || undefined,
        },
      },
    })

    return {
      endpointsQueryOptions,
    }
  },
  loader: async ({ context }) => {
    const { queryClient, endpointsQueryOptions } = context

    await queryClient.ensureQueryData(endpointsQueryOptions)
  },
  component: EndpointsPage,
})
