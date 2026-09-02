'use client'

import type { Table } from '@tanstack/react-table'
import type React from 'react'
import { SlidersHorizontalIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Menu,
} from '@/components/ui/menu'
import { cn } from '@/lib/cn'

export interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  className?: string
  title?: string
}

export function DataTableViewOptions<TData>({
  table,
  className,
  title = 'View',
}: DataTableViewOptionsProps<TData>): React.ReactElement {
  const columns = table
    .getAllColumns()
    .filter(
      column =>
        typeof column.accessorFn !== 'undefined' && column.getCanHide(),
    )

  return (
    <Menu>
      <DropdownMenuTrigger
        render={(
          <Button
            aria-label="Toggle column visibility"
            className={cn('ms-auto h-8 gap-2', className)}
            size="sm"
            variant="outline"
          >
            <SlidersHorizontalIcon className="size-4" />
            <span>{title}</span>
          </Button>
        )}
      />
      <DropdownMenuContent align="end" className="w-48" sideOffset={4}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {columns.map(column => (
            <DropdownMenuCheckboxItem
              checked={column.getIsVisible()}
              key={column.id}
              onCheckedChange={value => column.toggleVisibility(Boolean(value))}
            >
              <span className="capitalize">
                {column.id.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </Menu>
  )
}
