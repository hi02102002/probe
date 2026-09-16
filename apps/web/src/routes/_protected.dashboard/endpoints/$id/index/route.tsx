import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { getIngestUrl } from '@/features/endpoints'
import { TestSection } from './_components/test-section'

export const Route = createFileRoute('/_protected/dashboard/endpoints/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { getEndpointByIdQueryOptions } = useRouteContext({
    from: '/_protected/dashboard/endpoints/$id',
  })
  const { data: endpoint } = useSuspenseQuery(getEndpointByIdQueryOptions)

  const ingestUrl = getIngestUrl(endpoint.token)

  return (
    <div className="mt-4 flex flex-col gap-4">
      <TestSection
        endpointId={endpoint.id}
        ingestUrl={ingestUrl}
      />
    </div>
  )
}
