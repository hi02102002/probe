import { ArrowLeftIcon, PlayIcon, TrashIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useCanGoBack, useRouteContext } from '@tanstack/react-router'
import { BrandIcon } from '@/components/brand-icon'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { EndpointStatus } from '@/features/endpoints'

export function EndpointHeader() {
  const { getEndpointByIdQueryOptions } = useRouteContext({
    from: '/_protected/dashboard/endpoints/$id',
  })
  const isCanGoBack = useCanGoBack()

  const { data: endpoint } = useSuspenseQuery(getEndpointByIdQueryOptions)

  const ingestUrl = `${window.location.origin}/api/ingest/${endpoint.token}`

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
        className="gap-3.5 flex items-center justify-between"
      >
        <div
          className="flex gap-3.5 items-center"
        >
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-xs"
          >
            <BrandIcon
              name={endpoint.name}
            />
          </div>
          <div
            className="flex flex-col gap-0.5"
          >
            <div
              className="flex items-center gap-2"
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
              className="flex items-center gap-2 font-mono text-muted-foreground text-xs"
            >
              Token:
              {' '}
              {endpoint.token}
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-2 shrink-0"
        >
          <Button>
            <PlayIcon
              weight="duotone"
            />
            Play
          </Button>
          <Button
            variant="destructive-outline"
            size="icon"
          >
            <TrashIcon
              weight="duotone"
            />
          </Button>
        </div>
      </div>
      <div
        className="flex flex-col rounded-xl gap-2 border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-2.5"
      >
        <div
          className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2"
        >
          <div
            className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-[11px] text-primary uppercase"
          >
            Ingest URL
          </div>
          <span
            className="font-mono text-muted-foreground text-xs sm:text-sm"
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
