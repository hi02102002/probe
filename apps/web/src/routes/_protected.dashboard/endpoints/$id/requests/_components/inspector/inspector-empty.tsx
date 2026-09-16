import { CursorClickIcon } from '@phosphor-icons/react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function InspectorEmpty() {
  return (
    <section className="flex min-h-80 items-center justify-center rounded-xl border border-border bg-card p-6 lg:col-span-8">
      <Empty className="py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CursorClickIcon className="size-5 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle className="text-base">No request selected</EmptyTitle>
          <EmptyDescription>
            Select a request from the list to inspect its captured payload, headers, and response.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </section>
  )
}
