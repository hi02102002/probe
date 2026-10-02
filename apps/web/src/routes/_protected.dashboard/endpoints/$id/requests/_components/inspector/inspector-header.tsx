import type { RequestDetail } from '../../_types'
import { ArrowClockwiseIcon, DownloadSimpleIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { downloadRequestHar, getRequestPath } from '../../_utils/request-utils'

interface InspectorHeaderProps {
  readonly curl: string
  readonly endpointId: string
  readonly request: RequestDetail
}

export function InspectorHeader({ curl, endpointId, request }: InspectorHeaderProps) {
  const navigate = useNavigate()

  const status = request.statusCode ? Number(request.statusCode) : null
  const isSuccess = status !== null && status >= 200 && status < 300

  return (
    <div className="flex flex-col items-stretch gap-3 border-b border-border bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Badge variant={status === null ? 'outline' : isSuccess ? 'success' : 'destructive'}>
          {request.statusCode ?? 'Not captured'}
        </Badge>
        <span className="font-mono font-bold text-foreground text-sm">{request.method}</span>
        <span className="max-w-xs truncate font-mono text-muted-foreground text-xs sm:text-sm">
          {getRequestPath(request.url)}
        </span>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <CopyButton label="cURL" size="sm" text={curl} variant="outline" />
        <Button
          data-umami-event="Export request as HAR"
          data-umami-event-button-name="dashboard__inspector__export-har"
          onClick={() => downloadRequestHar(request)}
          size="sm"
          variant="outline"
        >
          <DownloadSimpleIcon weight="bold" />
          HAR
        </Button>
        <Button
          onClick={() => {
            navigate({
              params: { id: endpointId },
              search: { requestId: request.id },
              to: '/dashboard/endpoints/$id/replay',
            })
          }}
          size="sm"
        >
          <ArrowClockwiseIcon weight="bold" />
          Replay
        </Button>
      </div>
    </div>
  )
}
