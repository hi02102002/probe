import { createFileRoute } from '@tanstack/react-router'
import { EndpointsPage } from '@/features/endpoints'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints',
)({
  component: EndpointsPage,
})
