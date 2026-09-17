import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { AppShell, PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/layouts/dashboard'
import { Button } from '@/components/ui/button'
import { CreateEndpointDialog } from './_components/create-endpoint-dialog'
import { EndpointsTable } from './_components/endpoints-table'
import { endpointSearchSchema } from './_utils/search-params'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints/',
)({
  validateSearch: endpointSearchSchema,
  loaderDeps: ({ search }) => search,
  context: ({ context, deps }) => {
    const sort = deps.sortBy
      ? {
          by: deps.sortBy,
          order: deps.sortOrder ?? 'asc',
        }
      : undefined

    const endpointsQueryOptions = context.orpc.endpoint.list.queryOptions({
      input: {
        query: {
          sort,
          status: deps.status ?? undefined,
          pagination: {
            page: deps.page ?? 1,
            limit: deps.limit ?? 10,
          },
          query: deps.query || undefined,
        },
      },
    })

    return {
      endpointsQueryOptions,
    }
  },
  loader: async ({ context }) => {
    const { queryClient, endpointsQueryOptions } = context

    await queryClient.ensureQueryData(endpointsQueryOptions)
  },
  component: EndpointsPage,
})

function EndpointsPage() {
  return (
    <AppShell>
      <div className="flex items-start justify-between gap-4">
        <PageHeader>
          <PageHeaderTitle>
            Endpoints
          </PageHeaderTitle>
          <PageHeaderDescription>
            Create and manage your endpoints.
          </PageHeaderDescription>
        </PageHeader>
        <CreateEndpointDialog trigger={(
          <Button
            data-umami-event="New endpoint button clicked"
            data-umami-event-button-name="dashboard__endpoints__new-endpoint"
          >
            <PlusIcon />
            New endpoint
          </Button>
        )}
        />
      </div>
      <div className="mt-6">
        <EndpointsTable />
      </div>
    </AppShell>
  )
}
