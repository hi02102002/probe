import { PlusIcon } from '@phosphor-icons/react'
import { AppShell, PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/layouts/dashboard'
import { Button } from '@/components/ui/button'
import { CreateEndpointDialog } from './components/create-endpoint-dialog'

export function EndpointsPage() {
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
          <Button>
            <PlusIcon />
            New endpoint
          </Button>
        )}
        />
      </div>
    </AppShell>
  )
}
