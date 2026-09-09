import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/layouts/dashboard'
import { Divider } from '@/components/ui/divider'
import { EndpointHeader } from './_components/endpoint-header'
import { EndPointTabs } from './_components/endpoint-tabs'

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
      <div
        className="flex flex-col gap-5"
      >
        <EndpointHeader />
        <Divider />
        <EndPointTabs />
      </div>
      <Outlet />
    </AppShell>
  )
}
