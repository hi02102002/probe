import { ArrowLeftIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useCanGoBack, useNavigate, useRouteContext } from '@tanstack/react-router'
import { BrandIcon } from '@/components/brand-icon'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { EndpointStatus } from '@/features/endpoints'

import { DeleteEndpointDialog } from '@/features/endpoints/components/del-endpoint-dialog'
import { ToggleEndpointStatus } from './toggle-endpoint-status'
import { UpdateEndpointDialog } from './update-endpoint-dialog'

export function EndpointHeader() {
  const { getEndpointByIdQueryOptions } = useRouteContext({
    from: '/_protected/dashboard/endpoints/$id',
  })
  const navigate = useNavigate()

  const isCanGoBack = useCanGoBack()

  const { data: endpoint } = useSuspenseQuery(getEndpointByIdQueryOptions)

  const ingestUrl = `${window.location.origin}/api/ingest/${endpoint.token}`

  const handleDeletedEndpoint = () => {
    if (isCanGoBack) {
      navigate({ to: '..' })
    }
    else {
      navigate({ to: '/dashboard/endpoints' })
    }
  }

  return (
    <div
      className="flex flex-col gap-5"
    >
      <Breadcrumb>
        <BreadcrumbList
          className="sm:gap-1.5"
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              className="flex items-center gap-1"
              render={(props) => {
                return (
                  <Link
                    to={isCanGoBack ? '..' : '/dashboard/endpoints'}
                    {...props}
                  />
                )
              }}
            >
              <ArrowLeftIcon
                className="size-4"
              />
              Endpoints
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbPage>
            {endpoint.name}
          </BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <div
        className="flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div
          className="flex min-w-0 items-center gap-3.5"
        >
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-xs"
          >
            <BrandIcon
              name={endpoint.name}
            />
          </div>
          <div
            className="flex min-w-0 flex-col gap-0.5"
          >
            <div
              className="flex flex-wrap items-center gap-2"
            >
              <span
                className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl"
              >
                {endpoint.name}
              </span>
              <EndpointStatus
                status={endpoint.status}
              />
            </div>
            <span
              className="break-all font-mono text-muted-foreground text-xs"
            >
              Token:
              {' '}
              {endpoint.token}
            </span>
          </div>
        </div>
        <div
          className="flex shrink-0 items-center gap-2 self-end sm:self-auto"
        >
          <ToggleEndpointStatus
            status={endpoint.status}
            id={endpoint.id}
          />
          <UpdateEndpointDialog
            endpointId={endpoint.id}
            trigger={props => (
              <Button
                {...props}
                aria-label="Edit endpoint"
                size="icon"
                title="Edit endpoint"
                variant="outline"
              >
                <PencilSimpleIcon weight="duotone" />
              </Button>
            )}
          />
          <DeleteEndpointDialog
            trigger={props => (
              <Button
                variant="destructive-outline"
                size="icon"
                {...props}
              >
                <TrashIcon
                  weight="duotone"
                />
              </Button>
            )}
            endpointId={endpoint.id}
            onDeletedSuccess={handleDeletedEndpoint}
          />
        </div>
      </div>
      <div
        className="flex flex-col rounded-xl gap-2 border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-2.5"
      >
        <div
          className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2"
        >
          <div
            className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-[11px] text-primary uppercase"
          >
            Ingest URL
          </div>
          <span
            className="break-all font-mono text-muted-foreground text-xs sm:text-sm"
          >
            {ingestUrl}
          </span>
        </div>
        <CopyButton
          variant="outline"
          text={ingestUrl}
          size="icon-sm"
        />
      </div>
    </div>
  )
}
