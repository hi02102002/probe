import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints/$id/rules',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/dashboard/endpoints/$id/rules"!</div>
}
