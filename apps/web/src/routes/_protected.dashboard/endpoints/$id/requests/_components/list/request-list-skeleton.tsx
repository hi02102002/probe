import { Skeleton } from '@/components/ui/skeleton'

const SKELETON_ITEMS = ['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6'] as const

export function RequestListSkeleton() {
  return (
    <>
      {SKELETON_ITEMS.map(key => (
        <div className="space-y-2 p-3.5" key={key}>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </>
  )
}
