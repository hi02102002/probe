'use client'

import type React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/cn'

export interface DataTableSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  columnCount?: number
  rowCount?: number
  cellWidths?: string[]
  showToolbar?: boolean
  showPagination?: boolean
  variant?: 'card' | 'default'
}

export function DataTableSkeleton({
  columnCount = 4,
  rowCount = 5,
  cellWidths,
  showToolbar = false,
  showPagination = false,
  variant = 'default',
  className,
  ...props
}: DataTableSkeletonProps): React.ReactElement {
  return (
    <div className={cn('w-full space-y-3', className)} {...props}>
      {showToolbar && (
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-8 w-20" />
        </div>
      )}

      <Table variant={variant}>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columnCount }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableHead key={i}>
                <Skeleton
                  className={cn(
                    'h-4 w-20',
                    cellWidths?.[i] ? `w-[${cellWidths[i]}]` : undefined,
                  )}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableRow key={rowIndex}>
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <TableCell key={colIndex}>
                  <Skeleton
                    className={cn(
                      'h-4 w-full max-w-32',
                      cellWidths?.[colIndex] ? `w-[${cellWidths[colIndex]}]` : undefined,
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showPagination && (
        <div className="flex items-center justify-between gap-2 pt-2">
          <Skeleton className="h-5 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      )}
    </div>
  )
}
