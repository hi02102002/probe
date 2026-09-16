import type { RequestDetail } from '../../../_types'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/dayjs'
import { capturedEntries } from '../../../_utils/request-utils'
import { CapturedBlock } from '../captured-block'
import { EntriesTable } from '../entries-table'

interface ResponseTabProps {
  readonly request: RequestDetail
}

export function ResponseTab({ request }: ResponseTabProps) {
  const status = request.statusCode ? Number(request.statusCode) : null
  const isSuccess = status !== null && status >= 200 && status < 300
  const responseHeaders = capturedEntries(request.resHeaders)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/20 p-3 text-xs">
        <Badge variant={status === null ? 'outline' : isSuccess ? 'success' : 'destructive'}>
          {request.statusCode ?? 'Not captured'}
        </Badge>
        <span className="text-muted-foreground">
          Captured
          {' '}
          {formatDate(request.createdAt)}
        </span>
      </div>

      {request.resBody === null || request.resBody === undefined
        ? (
            <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
              Response body was not captured.
            </p>
          )
        : (
            <CapturedBlock label="Response body" value={request.resBody} />
          )}

      {responseHeaders.length > 0 && <EntriesTable empty="" entries={responseHeaders} />}
    </div>
  )
}
