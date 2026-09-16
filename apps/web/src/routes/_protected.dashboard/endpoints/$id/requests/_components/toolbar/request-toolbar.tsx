import type { ConnectionStatus } from '../../_types'
import { XIcon } from '@phosphor-icons/react'
import { useQueryStates } from 'nuqs'
import { Button } from '@/components/ui/button'
import { requestSearchParams } from '../../_utils/search-params'
import { RequestConnectionBadge } from './request-connection-badge'
import { RequestMethodSelect } from './request-method-select'
import { RequestSearchInput } from './request-search-input'

interface RequestToolbarProps {
  readonly connection: ConnectionStatus
  readonly isStreamError?: boolean
  readonly totalLoaded: number
}

export function RequestToolbar({
  connection,
  isStreamError,
  totalLoaded,
}: RequestToolbarProps) {
  const [params, setParams] = useQueryStates(requestSearchParams)
  const hasFilters = Boolean(params.query || params.method)

  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <RequestSearchInput />
        <RequestMethodSelect />
        {hasFilters && (
          <Button
            onClick={() => setParams({ method: null, query: null, requestId: null })}
            variant="ghost"
          >
            <XIcon className="size-3.5" />
            <span>Reset filters</span>
          </Button>
        )}
      </div>

      <RequestConnectionBadge
        connection={connection}
        isStreamError={isStreamError}
        totalLoaded={totalLoaded}
      />
    </div>
  )
}
