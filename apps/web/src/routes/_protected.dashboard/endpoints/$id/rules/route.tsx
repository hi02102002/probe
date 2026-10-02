import { createFileRoute } from '@tanstack/react-router'
import { RulesTab } from './_components/rules-tab'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints/$id/rules',
)({
  component: RulesRouteComponent,
  context: ({ context, params }) => {
    const ruleOptions = context.orpc.rule.get.queryOptions({
      input: {
        params: {
          endpointId: params.id,
        },
      },
    })

    return { ruleOptions }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(context.ruleOptions).catch(() => undefined)
  },
})

function RulesRouteComponent() {
  return <RulesTab />
}
