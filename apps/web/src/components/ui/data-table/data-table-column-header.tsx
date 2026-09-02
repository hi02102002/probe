'use client'

import type { Column } from '@tanstack/react-table'
import type React from 'react'
import {
  ArrowDownIcon,
  ArrowsDownUpIcon,
  ArrowUpIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

export interface DataTableColumnHeaderProps<TData, TValue>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  column: Column<TData, TValue>
  title: React.ReactNode
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>): React.ReactElement {
  'use no memo'

  if (!column.getCanSort()) {
    return <div className={cn('font-medium text-muted-foreground text-sm', className)}>{title}</div>
  }

  const isSorted = column.getIsSorted()

  const sortLabel = isSorted === 'asc'
    ? 'Sorted ascending (A→Z / Low→High). Click to sort descending.'
    : isSorted === 'desc'
      ? 'Sorted descending (Z→A / High→Low). Click to clear sorting.'
      : 'Click to sort ascending.'

  return (
    <div className={cn('group/header flex items-center', className)}>
      <Button
        aria-label={sortLabel}
        className={cn(
          '-ms-2 h-8 gap-1.5 px-2 text-sm transition-all',
          isSorted
            ? 'bg-accent/80 font-semibold text-foreground ring-1 ring-border/60'
            : 'font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground',
        )}
        onClick={column.getToggleSortingHandler()}
        size="sm"
        title={sortLabel}
        variant="ghost"
      >
        <span>{title}</span>
        {isSorted === 'desc' && (
          <ArrowDownIcon
            aria-hidden="true"
            className="size-3.5 shrink-0 text-foreground"
            weight="bold"
          />
        )}
        {isSorted === 'asc' && (
          <ArrowUpIcon
            aria-hidden="true"
            className="size-3.5 shrink-0 text-foreground"
            weight="bold"
          />
        )}
        {!isSorted && (
          <ArrowsDownUpIcon
            aria-hidden="true"
            className="size-3.5 shrink-0 text-muted-foreground/40 opacity-60 transition-opacity group-hover/header:opacity-100"
          />
        )}
      </Button>
    </div>
  )
}
