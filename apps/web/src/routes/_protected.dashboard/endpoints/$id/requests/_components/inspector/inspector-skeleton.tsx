import { Skeleton } from '@/components/ui/skeleton'

export function InspectorSkeleton() {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-5 lg:col-span-8">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-72" />
      <Skeleton className="h-80 w-full" />
    </section>
  )
}
