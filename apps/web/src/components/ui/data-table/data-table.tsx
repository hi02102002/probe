'use client'

import type {
  ColumnDef,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Table as TableInstance,
  VisibilityState,
} from '@tanstack/react-table'
import type React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useQueryStates } from 'nuqs'
import { useMemo, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Frame, FrameFooter } from '@/components/ui/frame'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/cn'
import { DataTableEmpty } from './data-table-empty'
import { DataTablePagination } from './data-table-pagination'
import { dataTableSearchParams } from './data-table-search-params'

export interface DataTableProps<TData, TValue = unknown>
  extends React.HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  // Optional external controlled table instance
  table?: TableInstance<TData>

  // Appearance
  variant?: 'card' | 'default'
  enableFrame?: boolean
  enableBorder?: boolean
  containerClassName?: string
  tableClassName?: string

  // Loading & Empty state
  loading?: boolean
  loadingRowCount?: number
  empty?: React.ReactNode

  // Pagination
  enablePagination?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showSelectedCount?: boolean

  // Row selection & interaction
  enableRowSelection?: boolean
  onRowClick?: (row: TData, event: React.MouseEvent<HTMLTableRowElement>) => void
  getRowClassName?: (row: Row<TData>) => string

  // Server-side / Manual control flags
  manualPagination?: boolean
  manualSorting?: boolean
  pageCount?: number
  rowCount?: number

  // Controlled states & handlers (when not passing table prop)
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (selection: RowSelectionState) => void
}

export function createSelectColumn<TData>(): ColumnDef<TData, any> {
  return {
    id: 'select',
    size: 28,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => {
      const isAllSelected = table.getIsAllPageRowsSelected()
      const isSomeSelected = table.getIsSomePageRowsSelected()
      return (
        <Checkbox
          aria-label="Select all rows"
          checked={isAllSelected}
          indeterminate={isSomeSelected && !isAllSelected}
          onCheckedChange={value => table.toggleAllPageRowsSelected(Boolean(value))}
        />
      )
    },
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={value => row.toggleSelected(Boolean(value))}
        onClick={e => e.stopPropagation()}
      />
    ),
  }
}

function resolveUpdater<T>(updater: T | ((old: T) => T), old: T): T {
  return typeof updater === 'function'
    ? (updater as (old: T) => T)(old)
    : updater
}

const SKELETON_KEYS = Array.from({ length: 20 }, (_, i) => `skeleton-row-${i + 1}`)

export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  table: externalTable,

  variant = 'default',
  enableFrame = false,
  enableBorder = true,
  containerClassName,
  tableClassName,

  loading = false,
  loadingRowCount = 5,
  empty,

  enablePagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 50],
  showPageSizeSelector = true,
  showSelectedCount = true,

  enableRowSelection = true,
  onRowClick,
  getRowClassName,

  manualPagination: manualPaginationProp,
  manualSorting: manualSortingProp,
  pageCount,
  rowCount,

  pagination: controlledPagination,
  onPaginationChange: setControlledPagination,
  sorting: controlledSorting,
  onSortingChange: setControlledSorting,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange: setControlledColumnVisibility,
  rowSelection: controlledRowSelection,
  onRowSelectionChange: setControlledRowSelection,

  className,
  ...props
}: DataTableProps<TData, TValue>): React.ReactElement {
  // Sync URL search params directly using defined dataTableSearchParams
  const [params, setParams] = useQueryStates(dataTableSearchParams)

  const urlPagination: PaginationState = useMemo(
    () => ({
      pageIndex: Math.max(0, (params.page ?? 1) - 1),
      pageSize: params.limit ?? initialPageSize,
    }),
    [params.page, params.limit, initialPageSize],
  )

  const urlSorting: SortingState = useMemo(() => {
    if (!params.sortBy)
      return []
    return [
      {
        desc: params.sortOrder === 'desc',
        id: params.sortBy,
      },
    ]
  }, [params.sortBy, params.sortOrder])

  // Internal state for non-URL states
  const [internalColumnVisibility, setInternalColumnVisibility] = useState<VisibilityState>({})
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({})

  const pagination = controlledPagination ?? urlPagination
  const sorting = controlledSorting ?? urlSorting
  const columnVisibility = controlledColumnVisibility ?? internalColumnVisibility
  const rowSelection = controlledRowSelection ?? internalRowSelection

  const memoizedColumns = useMemo(() => columns, [columns])
  const memoizedData = useMemo(() => data, [data])

  const defaultTable = useReactTable({
    columns: memoizedColumns,
    data: memoizedData,
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: manualPaginationProp ?? true,
    manualSorting: manualSortingProp ?? true,
    pageCount,
    rowCount,
    state: {
      columnVisibility,
      pagination,
      rowSelection,
      sorting,
    },
    onColumnVisibilityChange: (updater) => {
      setInternalColumnVisibility(updater)
      setControlledColumnVisibility?.(typeof updater === 'function' ? updater(columnVisibility) : updater)
    },
    onPaginationChange: (updater) => {
      const next = resolveUpdater(updater, pagination)
      setParams({
        limit: next.pageSize,
        page: next.pageIndex + 1,
      })
      setControlledPagination?.(next)
    },
    onRowSelectionChange: (updater) => {
      setInternalRowSelection(updater)
      setControlledRowSelection?.(typeof updater === 'function' ? updater(rowSelection) : updater)
    },
    onSortingChange: (updater) => {
      const next = resolveUpdater(updater, sorting)
      if (next.length > 0 && next[0]) {
        setParams({
          page: 1,
          sortBy: next[0].id,
          sortOrder: next[0].desc ? 'desc' : 'asc',
        })
      }
      else {
        setParams({
          sortBy: null,
          sortOrder: null,
        })
      }
      setControlledSorting?.(next)
    },
  })

  const table = externalTable ?? defaultTable

  const tableContent = (
    <>
      <Table className={cn('w-full', tableClassName)} variant={variant}>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const columnSize = header.column.getSize()
                const minSize = header.column.columnDef.minSize
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      minWidth: minSize ? `${minSize}px` : undefined,
                      width: columnSize && columnSize !== 150 ? `${columnSize}px` : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading
            ? (
                SKELETON_KEYS.slice(0, loadingRowCount).map(skeletonKey => (
                  <TableRow key={skeletonKey}>
                    {table.getVisibleLeafColumns().map(column => (
                      <TableCell key={column.id}>
                        <div className="h-4 w-full animate-pulse rounded-sm bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
            : table.getRowModel().rows.length > 0
              ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      className={cn(
                        onRowClick && 'cursor-pointer',
                        getRowClassName?.(row),
                      )}
                      data-state={row.getIsSelected() ? 'selected' : undefined}
                      key={row.id}
                      onClick={e => onRowClick?.(row.original, e)}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const columnSize = cell.column.getSize()
                        const minSize = cell.column.columnDef.minSize
                        return (
                          <TableCell
                            key={cell.id}
                            style={{
                              minWidth: minSize ? `${minSize}px` : undefined,
                              width: columnSize && columnSize !== 150 ? `${columnSize}px` : undefined,
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                )
              : (
                  <TableRow>
                    <TableCell
                      className="h-40 p-0 text-center"
                      colSpan={table.getVisibleLeafColumns().length}
                    >
                      {empty ?? <DataTableEmpty />}
                    </TableCell>
                  </TableRow>
                )}
        </TableBody>
      </Table>

      {enablePagination && (
        enableFrame
          ? (
              <FrameFooter className="p-3">
                <DataTablePagination
                  pageSizeOptions={pageSizeOptions}
                  showPageSizeSelector={showPageSizeSelector}
                  showSelectedCount={showSelectedCount}
                  table={table}
                />
              </FrameFooter>
            )
          : (
              <div className="border-t bg-card px-4 py-3">
                <DataTablePagination
                  pageSizeOptions={pageSizeOptions}
                  showPageSizeSelector={showPageSizeSelector}
                  showSelectedCount={showSelectedCount}
                  table={table}
                />
              </div>
            )
      )}
    </>
  )

  if (enableFrame) {
    return (
      <Frame className={cn('w-full', className)} {...props}>
        {tableContent}
      </Frame>
    )
  }

  return (
    <div
      className={cn(
        'w-full',
        enableBorder && 'rounded-lg border bg-card shadow-xs/5 overflow-hidden',
        containerClassName,
        className,
      )}
      {...props}
    >
      {tableContent}
    </div>
  )
}
