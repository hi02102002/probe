import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints/$id/replay',
)({
  component: RouteComponent,
  validateSearch: z.object({
    requestId: z.string().optional().catch(undefined),
  }),
})

function RouteComponent() {
  return <div>Hello "/_protected/dashboard/endpoints/$id/replay"!</div>
}
