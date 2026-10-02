import { createFileRoute } from '@tanstack/react-router'
import { ForwardsTab } from './_components/forwards-tab'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints/$id/forwards',
)({
  component: ForwardsRouteComponent,
  context: ({ context, params }) => {
    const forwardListOptions = context.orpc.forward.list.infiniteOptions({
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

    return { forwardListOptions }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureInfiniteQueryData(context.forwardListOptions).catch(() => undefined)
  },
})

function ForwardsRouteComponent() {
  return <ForwardsTab />
}
