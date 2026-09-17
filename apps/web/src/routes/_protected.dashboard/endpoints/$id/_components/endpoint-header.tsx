import { ArrowLeftIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useCanGoBack, useNavigate, useRouteContext } from '@tanstack/react-router'
import { BrandIcon } from '@/components/brand-icon'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { EndpointStatus, getIngestUrl } from '@/features/endpoints'

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

  const ingestUrl = getIngestUrl(endpoint.token)

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
              data-umami-event="Endpoint back to list clicked"
              data-umami-event-button-name="dashboard__endpoint-header__back-to-endpoints"
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
          <BreadcrumbPage className="truncate max-w-[160px] sm:max-w-none">
            {endpoint.name}
          </BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <div
        className="flex items-center justify-between gap-3"
      >
        <div
          className="flex min-w-0 items-center gap-3 sm:gap-3.5"
        >
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-xs sm:size-12"
          >
            <BrandIcon
              name={endpoint.name}
            />
          </div>
          <div
            className="flex min-w-0 flex-col gap-0.5"
          >
            <div
              className="flex items-center gap-2"
            >
              <span
                className="truncate font-semibold text-foreground text-lg tracking-tight sm:text-2xl"
              >
                {endpoint.name}
              </span>
              <div className="shrink-0">
                <EndpointStatus
                  status={endpoint.status}
                />
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 font-mono text-muted-foreground text-xs"
            >
              <span className="shrink-0 text-muted-foreground/70">Token:</span>
              <span
                className="truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none"
                title={endpoint.token}
              >
                {endpoint.token}
              </span>
              <CopyButton
                aria-label="Copy token"
                className="size-5 shrink-0 text-muted-foreground/60 hover:text-foreground"
                size="icon-xs"
                text={endpoint.token}
                variant="ghost"
              />
            </div>
          </div>
        </div>
        <div
          className="flex shrink-0 items-center gap-1.5 sm:gap-2"
        >
          <ToggleEndpointStatus
            id={endpoint.id}
            status={endpoint.status}
          />
          <UpdateEndpointDialog
            endpointId={endpoint.id}
            trigger={props => (
              <Button
                {...props}
                aria-label="Edit endpoint"
                data-umami-event="Edit endpoint dialog clicked"
                data-umami-event-button-name="dashboard__endpoint-header__edit-endpoint"
                size="icon"
                title="Edit endpoint"
                variant="outline"
              >
                <PencilSimpleIcon weight="duotone" />
              </Button>
            )}
          />
          <DeleteEndpointDialog
            endpointId={endpoint.id}
            onDeletedSuccess={handleDeletedEndpoint}
            trigger={props => (
              <Button
                aria-label="Delete endpoint"
                data-umami-event="Delete endpoint dialog clicked"
                data-umami-event-button-name="dashboard__endpoint-header__delete-endpoint"
                size="icon"
                title="Delete endpoint"
                variant="destructive-outline"
                {...props}
              >
                <TrashIcon
                  weight="duotone"
                />
              </Button>
            )}
          />
        </div>
      </div>
      <div
        className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-2.5"
      >
        <div
          className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5"
        >
          <div className="flex items-center justify-between gap-2 sm:justify-start">
            <span
              className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-[11px] text-primary uppercase tracking-wide"
            >
              Ingest URL
            </span>
            <div className="sm:hidden">
              <CopyButton
                aria-label="Copy Ingest URL"
                size="icon-sm"
                text={ingestUrl}
                variant="outline"
              />
            </div>
          </div>
          <span
            className="break-all font-mono text-muted-foreground text-xs select-all sm:text-sm"
            title={ingestUrl}
          >
            {ingestUrl}
          </span>
        </div>
        <div className="hidden shrink-0 sm:block">
          <CopyButton
            aria-label="Copy Ingest URL"
            size="icon-sm"
            text={ingestUrl}
            variant="outline"
          />
        </div>
      </div>
    </div>
  )
}
