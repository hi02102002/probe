import { createFileRoute } from '@tanstack/react-router'
import { AppShell, PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/layouts/dashboard'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints_/$endpointId',
)({
  component: EndpointDetailPage,
  head: () => generateAppSeo({
    description: 'Inspect and manage an endpoint.',
    pathname: '/dashboard/endpoints',
    robots: {
      follow: false,
      index: false,
    },
    title: 'Endpoint details',
  }),
})

function EndpointDetailPage() {
  const { endpointId } = Route.useParams()

  return (
    <AppShell>
      <PageHeader>
        <PageHeaderTitle>Endpoint details</PageHeaderTitle>
        <PageHeaderDescription>{endpointId}</PageHeaderDescription>
      </PageHeader>
    </AppShell>
  )
}
