import type { ConnectionStatus } from '../../_types'
import { cn } from '@/lib/cn'

interface RequestConnectionBadgeProps {
  readonly connection: ConnectionStatus
  readonly isStreamError?: boolean
  readonly totalLoaded: number
}

export function RequestConnectionBadge({
  connection,
  isStreamError,
  totalLoaded,
}: RequestConnectionBadgeProps) {
  const isListening = !isStreamError && connection.tone === 'bg-success'

  return (
    <output className="flex items-center gap-2 self-start text-muted-foreground text-xs sm:self-auto">
      <span className="relative flex size-2">
        {isListening && (
          <span className={cn('absolute inline-flex size-full animate-ping rounded-full opacity-60', connection.tone)} />
        )}
        <span className={cn('relative inline-flex size-2 rounded-full', connection.tone)} />
      </span>
      <span className="font-medium text-foreground">{connection.label}</span>
      <span>
        (
        {totalLoaded}
        {' '}
        loaded)
      </span>
    </output>
  )
}
