import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints/$id/requests',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/dashboard/endpoints/$id/requests"!</div>
}
