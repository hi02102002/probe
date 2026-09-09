import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/layouts/dashboard'
import { EndpointHeader } from './_components/endpoint-header'

export const Route = createFileRoute('/_protected/dashboard/endpoints/$id')({
  component: RouteComponent,
  context: ({ context, params }) => {
    const getEndpointByIdQueryOptions = context.orpc.endpoint.getById.queryOptions({
      input: {
        params: {
          id: params.id,
        },
      },
    })

    return {
      getEndpointByIdQueryOptions,
    }
  },
  loader: async ({ context }) => {
    const endpoint = await context.queryClient.ensureQueryData(context.getEndpointByIdQueryOptions)

    return {
      endpoint,
    }
  },
})

function RouteComponent() {
  return (
    <AppShell>
      <EndpointHeader />
      <Outlet />
    </AppShell>
  )
}
