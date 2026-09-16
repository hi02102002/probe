import type * as React from 'react'
import type { RequestSummary } from '../../_types'
import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'
import { formatRelativeTime } from '@/lib/dayjs'
import { getRequestPath } from '../../_utils/request-utils'

export interface RequestListItemProps extends useRender.ComponentProps<'button'> {
  readonly isSelected?: boolean
  readonly request: RequestSummary
}

export function RequestListItem({
  className,
  isSelected,
  render,
  request,
  ...props
}: RequestListItemProps): React.ReactElement {
  const status = request.statusCode ? Number(request.statusCode) : null
  const isSuccess = status !== null && status >= 200 && status < 300

  const defaultProps = {
    'aria-current': isSelected ? ('true' as const) : undefined,
    'children': (
      <>
        <span className="flex w-full items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2">
            <Badge
              className="font-mono"
              size="sm"
              variant={status === null ? 'outline' : isSuccess ? 'success' : 'destructive'}
            >
              {request.statusCode ?? 'N/A'}
            </Badge>
            <span className="font-mono font-semibold text-foreground text-xs">
              {request.method}
            </span>
          </span>
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
            {formatRelativeTime(request.createdAt)}
          </span>
        </span>
        <span className="w-full truncate font-mono text-muted-foreground text-xs">
          {getRequestPath(request.url)}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {request.size ? `${request.size} B` : 'Size not captured'}
        </span>
      </>
    ),
    'className': cn(
      'flex w-full cursor-pointer flex-col gap-1.5 border-b border-l-2 border-b-border p-3.5 text-left transition-colors',
      isSelected
        ? 'border-l-primary bg-accent/50'
        : 'border-l-transparent hover:bg-muted/30',
      className,
    ),
    'type': render ? undefined : ('button' as const),
  }

  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    render,
  })
}
