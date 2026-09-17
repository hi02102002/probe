import { Link, useMatchRoute, useParams } from '@tanstack/react-router'
import { cn } from 'cn'
import { useMemo } from 'react'

import {
  segmentedControlItemVariants,
  segmentedControlRootClassName,
} from '@/lib/segmented-control'

export function EndPointTabs() {
  const { id } = useParams({ from: '/_protected/dashboard/endpoints/$id' })
  const matchRoute = useMatchRoute()

  const links = useMemo(() => [
    {
      label: 'Overview',
      toOptions: {
        params: { id },
        to: '/dashboard/endpoints/$id' as const,
      },
    },
    {
      label: 'Requests',
      toOptions: {
        params: { id },
        to: '/dashboard/endpoints/$id/requests' as const,
      },
    },
    {
      label: 'Replay',
      toOptions: {
        params: { id },
        to: '/dashboard/endpoints/$id/replay' as const,
      },
    },
    {
      label: 'Rules',
      toOptions: {
        params: { id },
        to: '/dashboard/endpoints/$id/rules' as const,
      },
    },
  ], [id])

  const matchedIndex = links.findIndex(link =>
    matchRoute({
      ...link.toOptions,
      fuzzy: false,
    }),
  )
  const activeIndex = Math.max(matchedIndex, 0)

  return (
    <div
      className={cn(
        segmentedControlRootClassName,
        'grid before:pointer-events-none before:absolute before:inset-0.5 before:left-[var(--indicator-left)] before:w-[var(--indicator-width)] before:rounded-md before:bg-background before:shadow-sm/5 before:transition-[left] before:duration-200 before:ease-out dark:before:bg-input',
      )}
      style={
        {
          '--indicator-left': `calc(2px + ${activeIndex} * (var(--indicator-width) + 2px))`,
          '--indicator-width': `calc((100% - 4px - ${(links.length - 1) * 2}px) / ${links.length})`,
          'gridTemplateColumns': `repeat(${links.length}, minmax(0, 1fr))`,
        } as React.CSSProperties
      }
    >
      {links.map((link, index) => (
        <Link
          activeOptions={{
            exact: true,
          }}
          className={cn(
            segmentedControlItemVariants(),
            'relative z-10 bg-transparent',
            {
              'text-foreground hover:text-foreground': activeIndex === index,
            },
          )}
          data-umami-link-event="Endpoint tab clicked"
          data-umami-event-button-name={`dashboard__endpoint-tabs__${link.label.toLowerCase()}`}
          key={link.toOptions.to}
          {...link.toOptions}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
