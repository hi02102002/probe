import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { AppShell, PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/layouts/dashboard'
import { Button } from '@/components/ui/button'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/_protected/dashboard/')({
  component: DashboardPage,
  head: () => generateAppSeo({
    description: 'Protected Probe dashboard.',
    pathname: '/dashboard',
    robots: {
      follow: false,
      index: false,
    },
    title: 'Endpoints',
  }),
})

function DashboardPage() {
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
        <Button>
          <PlusIcon />
          New endpoint
        </Button>
      </div>
    </AppShell>
  )
}
