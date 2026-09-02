import type { ContractOutputs } from '@repo/api-contracts'
import {
  ArrowSquareOutIcon,
  CopyIcon,
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { BrandIcon } from '@/components/brand-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Menu,
} from '@/components/ui/menu'
import { toastManager } from '@/components/ui/toast'
import { cn } from '@/lib/cn'
import { formatDate, formatRelativeTime } from '@/lib/dayjs'
import { statusConfig } from '../../endpoint-constants'

export type Endpoint = ContractOutputs['endpoint']['list']['items'][number]

export function EndpointNameCell({ item }: { item: Endpoint }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted/40 shadow-xs/5">
        <BrandIcon className="size-4 shrink-0" name={item.name} />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-medium text-foreground">{item.name}</span>
        <span className="truncate font-mono text-muted-foreground text-xs">{item.id}</span>
      </div>
    </div>
  )
}

export function StatusCell({ status }: { status?: Endpoint['status'] }) {
  const currentStatus = (status ?? 'inactive') as keyof typeof statusConfig
  const config = statusConfig[currentStatus] ?? statusConfig.inactive

  return (
    <Badge variant={config.variant}>
      <span
        aria-hidden="true"
        className={cn('size-1.5 rounded-full', config.dotColor)}
      />
      <span>{config.label}</span>
    </Badge>
  )
}

export function TokenCell({ token }: { token: string }) {
  const ingestUrl = `https://probe.dev/ep/${token}`

  return (
    <div className="flex items-center gap-1.5 font-mono text-xs">
      <span className="max-w-44 truncate text-muted-foreground sm:max-w-60">
        probe.dev/ep/
        {token}
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
    <span className="text-muted-foreground text-xs">
      {formatRelativeTime(lastRequestAt)}
    </span>
  )
}

export function CreatedAtCell({ createdAt }: { createdAt?: Date | string | null }) {
  return (
    <span className="text-muted-foreground text-xs tabular-nums">
      {formatDate(createdAt)}
    </span>
  )
}

export interface ActionsCellProps {
  item: Endpoint
  onEdit?: (item: Endpoint) => void
  onDelete?: (item: Endpoint) => void
}

export function ActionsCell({ item, onEdit, onDelete }: ActionsCellProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex justify-end" onClick={e => e.stopPropagation()}>
      <Menu>
        <DropdownMenuTrigger
          render={(
            <Button
              aria-label="Open endpoint actions"
              className="size-8 p-0"
              size="icon-sm"
              variant="ghost"
            >
              <DotsThreeVerticalIcon className="size-4" />
            </Button>
          )}
        />
        <DropdownMenuContent align="end" className="w-44" sideOffset={4}>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => copyToClipboard(`https://probe.dev/ep/${item.token}`)}
            >
              <CopyIcon className="size-4" />
              <span>Copy URL</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => copyToClipboard(item.token)}
            >
              <ArrowSquareOutIcon className="size-4" />
              <span>Copy Token</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (onEdit) {
                  onEdit(item)
                }
                else {
                  toastManager.add({
                    description: `Editing ${item.name}`,
                    title: 'Edit endpoint',
                    type: 'info',
                  })
                }
              }}
            >
              <PencilSimpleIcon className="size-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                if (onDelete) {
                  onDelete(item)
                }
                else {
                  toastManager.add({
                    description: `Deleted ${item.name}`,
                    title: 'Endpoint deleted',
                    type: 'success',
                  })
                }
              }}
              variant="destructive"
            >
              <TrashIcon className="size-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </Menu>
    </div>
  )
}
