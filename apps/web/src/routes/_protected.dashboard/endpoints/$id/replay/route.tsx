import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints/$id/replay',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/dashboard/endpoints/$id/replay"!</div>
}
