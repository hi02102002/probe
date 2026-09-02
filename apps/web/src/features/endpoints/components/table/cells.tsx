import type { ContractOutputs } from '@repo/api-contracts'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { useSyncExternalStore } from 'react'
import { BrandIcon } from '@/components/brand-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { cn } from '@/lib/cn'
import { formatDate, formatRelativeTime } from '@/lib/dayjs'
import { statusConfig } from '../../endpoint-constants'

export type Endpoint = ContractOutputs['endpoint']['list']['items'][number]

const subscribeToOrigin = () => () => {}

function useCurrentOrigin() {
  return useSyncExternalStore(
    subscribeToOrigin,
    () => window.location.origin,
    () => '',
  )
}

function getIngestUrl(token: string, origin: string) {
  const path = `/ep/${token}`
  return origin ? `${origin}${path}` : path
}

export function EndpointNameCell({ item }: { item: Endpoint }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40 shadow-xs/5">
        <BrandIcon className="size-4.5 shrink-0" name={item.name} />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-medium text-foreground text-sm leading-tight">{item.name}</span>
        <span className="truncate font-mono text-muted-foreground text-xs leading-tight">{item.id}</span>
      </div>
    </div>
  )
}

export function StatusCell({ status }: { status?: Endpoint['status'] }) {
  const currentStatus = (status ?? 'inactive') as keyof typeof statusConfig
  const config = statusConfig[currentStatus] ?? statusConfig.inactive

  return (
    <div className="flex items-center">
      <Badge variant={config.variant}>
        <span
          aria-hidden="true"
          className={cn('size-1.5 rounded-full', config.dotColor)}
        />
        <span>{config.label}</span>
      </Badge>
    </div>
  )
}

export function TokenCell({ token }: { token: string }) {
  const origin = useCurrentOrigin()
  const ingestUrl = getIngestUrl(token, origin)
  const displayUrl = ingestUrl.replace(/^https?:\/\//, '')

  return (
    <div className="flex items-center gap-1.5 font-mono text-xs">
      <span
        className="truncate text-muted-foreground"
        title={ingestUrl}
      >
        {displayUrl}
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
        render={(
          <Link
            params={{ endpointId: item.id }}
            preload="intent"
            to="/dashboard/endpoints/$endpointId"
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
