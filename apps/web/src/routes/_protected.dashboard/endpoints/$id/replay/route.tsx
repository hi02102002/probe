import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ReplayTab } from './_components/replay-tab'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints/$id/replay',
)({
  component: ReplayRouteComponent,
  validateSearch: z.object({
    requestId: z.string().optional().catch(undefined),
  }),
  loaderDeps: ({ search }) => ({
    requestId: search.requestId || undefined,
  }),
  context: ({ context, deps, params }) => {
    const replayListOptions = context.orpc.replay.list.infiniteOptions({
      getNextPageParam: lastPage => lastPage.nextCursor,
      initialPageParam: null,
      input: cursor => ({
        params: {
          endpointId: params.id,
        },
        query: {
          cursor: cursor ?? undefined,
          limit: 25,
        },
      }),
    })

    const sourceRequestOptions = deps.requestId
      ? context.orpc.request.getById.queryOptions({
          input: {
            params: {
              endpointId: params.id,
              requestId: deps.requestId,
            },
          },
        })
      : undefined

    return {
      replayListOptions,
      sourceRequestOptions,
    }
  },
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureInfiniteQueryData(context.replayListOptions),
      context.sourceRequestOptions
        ? context.queryClient.ensureQueryData(context.sourceRequestOptions).catch(() => undefined)
        : Promise.resolve(),
    ])
  },
})

function ReplayRouteComponent() {
  const { requestId } = Route.useSearch()

  return <ReplayTab sourceRequestId={requestId} />
}
