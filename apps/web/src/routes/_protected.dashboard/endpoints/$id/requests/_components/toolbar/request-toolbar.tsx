import type { ConnectionStatus } from '../../_types'
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
  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <RequestSearchInput />
        <RequestMethodSelect />
      </div>

      <RequestConnectionBadge
        connection={connection}
        isStreamError={isStreamError}
        totalLoaded={totalLoaded}
      />
    </div>
  )
}
