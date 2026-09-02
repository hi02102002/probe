'use client'

import type { Table } from '@tanstack/react-table'
import type React from 'react'
import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/cn'

export interface DataTablePaginationProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  pageSizeOptions?: number[]
  showSelectedCount?: boolean
  showPageSizeSelector?: boolean
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 50],
  showSelectedCount = true,
  showPageSizeSelector = true,
  className,
}: DataTablePaginationProps<TData>): React.ReactElement {
  'use no memo'

  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const pageCount = Math.max(table.getPageCount(), 1)
  const rowCount = table.getRowCount()
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length

  const start = rowCount > 0 ? pageIndex * pageSize + 1 : 0
  const end = Math.min((pageIndex + 1) * pageSize, rowCount)

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm',
        className,
      )}
    >
      {/* Left side: Results count & Selection */}
      <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
        {showSelectedCount && selectedRowCount > 0
          ? (
              <span className="font-medium text-foreground">
                {selectedRowCount}
                {' '}
                of
                {' '}
                {table.getFilteredRowModel().rows.length}
                {' '}
                row(s) selected
              </span>
            )
          : (
              <span>
                Showing
                {' '}
                <strong className="font-medium text-foreground">
                  {start}
                  –
                  {end}
                </strong>
                {' '}
                of
                {' '}
                <strong className="font-medium text-foreground">{rowCount}</strong>
                {' '}
                results
              </span>
            )}
      </div>

      {/* Right side: Rows per page + Page indicator + Nav buttons */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-end">
        {showPageSizeSelector && (
          <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
            <span>Rows per page</span>
            <Select
              items={pageSizeOptions.map(size => ({
                label: String(size),
                value: String(size),
              }))}
              onValueChange={(value) => {
                if (value) {
                  table.setPageSize(Number(value))
                }
              }}
              value={String(pageSize)}
            >
              <SelectTrigger
                aria-label="Select rows per page"
                className="h-8 w-18 min-w-0 px-2.5"
                size="sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectPopup className="min-w-18">
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </div>
        )}

        <div className="flex items-center text-muted-foreground whitespace-nowrap">
          <span>
            Page
            {' '}
            <strong className="font-medium text-foreground">{pageIndex + 1}</strong>
            {' '}
            of
            {' '}
            <strong className="font-medium text-foreground">{pageCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            aria-label="Go to first page"
            className="size-8 p-0"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            size="sm"
            variant="outline"
          >
            <CaretDoubleLeftIcon className="size-4" />
          </Button>

          <Button
            aria-label="Go to previous page"
            className="size-8 p-0"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            size="sm"
            variant="outline"
          >
            <CaretLeftIcon className="size-4" />
          </Button>

          <Button
            aria-label="Go to next page"
            className="size-8 p-0"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            size="sm"
            variant="outline"
          >
            <CaretRightIcon className="size-4" />
          </Button>

          <Button
            aria-label="Go to last page"
            className="size-8 p-0"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(pageCount - 1)}
            size="sm"
            variant="outline"
          >
            <CaretDoubleRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
