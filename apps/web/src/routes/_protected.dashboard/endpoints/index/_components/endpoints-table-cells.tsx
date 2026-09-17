import type { ContractOutputs } from '@repo/api-contracts'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { BrandIcon } from '@/components/brand-icon'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { EndpointStatus, getIngestUrl } from '@/features/endpoints'
import { formatDate, formatRelativeTime } from '@/lib/dayjs'

export type Endpoint = ContractOutputs['endpoint']['list']['items'][number]

export function EndpointNameCell({ item }: { item: Endpoint }) {
  return (
    <Link
      className="group inline-flex min-w-0 items-center gap-3 text-left focus-visible:outline-none"
      data-umami-link-event="View endpoint details"
      data-umami-event-button-name="dashboard__endpoints__view-endpoint"
      params={{ id: item.id }}
      preload="intent"
      to="/dashboard/endpoints/$id"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40 shadow-xs/5 transition-colors group-hover:bg-muted/70">
        <BrandIcon className="size-4.5 shrink-0" name={item.name} />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-medium text-foreground text-sm leading-tight transition-colors group-hover:text-primary group-hover:underline">
          {item.name}
        </span>
        <span className="truncate font-mono text-muted-foreground text-xs leading-tight">
          {item.id}
        </span>
      </div>
    </Link>
  )
}

export function StatusCell({ status }: { status?: Endpoint['status'] }) {
  return <EndpointStatus status={status} />
}

export function TokenCell({ token }: { token: string }) {
  const ingestUrl = getIngestUrl(token)

  return (
    <div
      className="flex items-center gap-1.5 font-mono text-xs"
      onClick={e => e.stopPropagation()}
    >
      <span
        className="truncate text-muted-foreground"
        title={ingestUrl}
      >
        {ingestUrl}
      </span>
      <CopyButton
        aria-label="Copy Ingest URL"
        size="icon-xs"
        text={ingestUrl}
        variant="ghost"
      />
    </div>
  )
}

export function LastActiveCell({ lastRequestAt }: { lastRequestAt?: Date | string | null }) {
  return (
    <div className="flex items-center text-muted-foreground text-xs whitespace-nowrap">
      {formatRelativeTime(lastRequestAt)}
    </div>
  )
}

export function CreatedAtCell({ createdAt }: { createdAt?: Date | string | null }) {
  return (
    <div className="flex items-center text-muted-foreground text-xs tabular-nums whitespace-nowrap">
      {formatDate(createdAt)}
    </div>
  )
}

export function ActionsCell({ item }: { item: Endpoint }) {
  return (
    <div className="flex items-center justify-end pr-1" onClick={e => e.stopPropagation()}>
      <Button
        aria-label={`View ${item.name} details`}
        data-umami-link-event="View endpoint details"
        data-umami-event-button-name="dashboard__endpoints__action-view-endpoint"
        render={(
          <Link
            params={{ id: item.id }}
            preload="intent"
            to="/dashboard/endpoints/$id"
          />
        )}
        size="icon-sm"
        title="View endpoint details"
        variant="ghost"
      >
        <ArrowRightIcon aria-hidden="true" />
      </Button>
    </div>
  )
}
