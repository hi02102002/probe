import type { ContractOutputs } from '@repo/api-contracts'
import { formatDate } from '@/lib/dayjs'

export type DashboardTrendPoint = ContractOutputs['dashboard']['trend']['points'][number]

/**
 * Hourly request bars for the last 24 hours. Values are percentages of the
 * tallest bucket, so a single-request hour still reads visually.
 */
export function RequestsTrendChart({ points }: { points: DashboardTrendPoint[] }) {
  const max = Math.max(...points.map(point => point.total), 1)
  const isEmpty = points.every(point => point.total === 0)

  return (
    <div>
      <div className="relative h-28" role="img" aria-label="Captured requests per hour, last 24 hours">
        <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map(line => (
            <div className="h-px w-full bg-border/60" key={line} />
          ))}
        </div>
        <div className="absolute inset-0 flex items-end gap-1">
          {points.map((point) => {
            const percent = Math.round((point.total / max) * 100)
            return (
              <div
                className="group relative flex h-full flex-1 items-end"
                key={point.hour}
                title={`${point.total} ${point.total === 1 ? 'request' : 'requests'} · ${formatDate(point.hour, 'HH:mm')}`}
              >
                <div
                  className={`w-full rounded-t-[3px] transition-[height] duration-500 ${point.total > 0 ? 'bg-chart-2/70 group-hover:bg-chart-2' : 'bg-chart-2/15'}`}
                  style={{ height: point.total > 0 ? `${Math.max(percent, 8)}%` : '3px' }}
                />
              </div>
            )
          })}
        </div>
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="rounded-md bg-background/80 px-3 py-1 text-muted-foreground text-xs">
              No requests captured in the last 24 hours
            </p>
          </div>
        )}
      </div>
      <div aria-hidden="true" className="mt-2 flex justify-between font-mono text-muted-foreground text-[10px]">
        <span>-24h</span>
        <span className="hidden sm:inline">-12h</span>
        <span>now</span>
      </div>
    </div>
  )
}
