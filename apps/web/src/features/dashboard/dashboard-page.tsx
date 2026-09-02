import { PlusIcon } from '@phosphor-icons/react'
import { AppShell } from '@/components/layouts/dashboard/app-shell'
import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/layouts/dashboard/page-header'
import { Button } from '@/components/ui/button'

export function DashboardPage() {
  return (
    <AppShell>
      <div
        className="flex items-start justify-between gap-4"
      >
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
