import { PulseIcon } from '@phosphor-icons/react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function RequestListEmpty() {
  return (
    <Empty className="py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PulseIcon className="size-5 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle className="text-base">No requests found</EmptyTitle>
        <EmptyDescription>
          No matching webhook requests captured yet.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
