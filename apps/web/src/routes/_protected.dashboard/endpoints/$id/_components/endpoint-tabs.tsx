import type { ToOptions } from '@tanstack/react-router'
import type { CSSProperties, ReactNode } from 'react'
import { Link, useMatchRoute } from '@tanstack/react-router'
import { cn } from 'cn'
import { useState } from 'react'

import {
  segmentedControlItemVariants,
  segmentedControlRootClassName,
} from '@/lib/segmented-control'

const LINKS: Array<{
  label: string | ReactNode
  toOptions: ToOptions
}> = [
  {
    label: 'Overview',
    toOptions: {
      to: '/dashboard/endpoints/$id',
    },
  },
  {
    label: 'Requests',
    toOptions: {
      to: '/dashboard/endpoints/$id/requests',
    },
  },
  {
    label: 'Replay',
    toOptions: {
      to: '/dashboard/endpoints/$id/replay',
    },
  },
  {
    label: 'Rules',
    toOptions: {
      to: '/dashboard/endpoints/$id/rules',
    },
  },
]

export function EndPointTabs() {
  const matchRoute = useMatchRoute()

  const [activeIndex, setActiveIndex] = useState(() => {
    const index = LINKS.findIndex(link =>
      matchRoute({
        ...link.toOptions,
        fuzzy: false,
      }),
    )

    return Math.max(index, 0)
  })

  return (
    <div
      className={cn(
        segmentedControlRootClassName,
        'grid before:pointer-events-none before:absolute before:inset-0.5 before:left-[var(--indicator-left)] before:w-[var(--indicator-width)] before:rounded-md before:bg-background before:shadow-sm/5 before:transition-[left] before:duration-200 before:ease-out dark:before:bg-input',
      )}
      style={
        {
          '--indicator-width': `calc((100% - 4px - ${(LINKS.length - 1) * 2}px) / ${LINKS.length})`,
          '--indicator-left': `calc(2px + ${activeIndex} * (var(--indicator-width) + 2px))`,
          'gridTemplateColumns': `repeat(${LINKS.length}, minmax(0, 1fr))`,
        } as CSSProperties
      }
    >
      {LINKS.map((link, index) => (
        <Link
          key={link.toOptions.to}
          {...link.toOptions}
          activeOptions={{
            exact: true,
          }}
          onClick={() => setActiveIndex(index)}
          className={cn(
            segmentedControlItemVariants(),
            'relative z-10 bg-transparent',
            {
              'text-foreground hover:text-foreground': activeIndex === index,
            },
          )}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
