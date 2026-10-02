import { createFileRoute } from '@tanstack/react-router'
import { ForwardsTab } from './_components/forwards-tab'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints/$id/forwards',
)({
  component: ForwardsRouteComponent,
  context: ({ context, params }) => {
    const ruleOptions = context.orpc.rule.get.queryOptions({
      input: {
        params: {
          endpointId: params.id,
        },
      },
    })

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

    return {
      forwardListOptions,
      ruleOptions,
    }
  },
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(context.ruleOptions).catch(() => undefined),
      context.queryClient.ensureInfiniteQueryData(context.forwardListOptions).catch(() => undefined),
    ])
  },
})

function ForwardsRouteComponent() {
  return <ForwardsTab />
}
