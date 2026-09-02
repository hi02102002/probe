import type { Endpoint } from './cells'
import type { ColumnDef } from '@/components/ui/data-table'
import { DataTableColumnHeader } from '@/components/ui/data-table'
import {
  ActionsCell,
  CreatedAtCell,
  EndpointNameCell,
  LastActiveCell,
  StatusCell,
  TokenCell,
} from './cells'

export interface CreateEndpointColumnsOptions {
  onEdit?: (item: Endpoint) => void
  onDelete?: (item: Endpoint) => void
}

export function createEndpointColumns(
  options: CreateEndpointColumnsOptions = {},
): ColumnDef<Endpoint>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Endpoint Name" />
      ),
      minSize: 220,
      size: 260,
      cell: ({ row }) => <EndpointNameCell item={row.original} />,
    },
    {
      accessorKey: 'status',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      minSize: 110,
      size: 120,
      cell: ({ row }) => <StatusCell status={row.getValue('status')} />,
    },
    {
      accessorKey: 'token',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ingest URL / Token" />
      ),
      minSize: 240,
      size: 260,
      cell: ({ row }) => <TokenCell token={row.getValue('token')} />,
    },
    {
      accessorKey: 'lastRequestAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Active" />
      ),
      minSize: 120,
      size: 130,
      cell: ({ row }) => (
        <LastActiveCell lastRequestAt={row.getValue('lastRequestAt')} />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      minSize: 120,
      size: 130,
      cell: ({ row }) => <CreatedAtCell createdAt={row.getValue('createdAt')} />,
    },
    {
      id: 'actions',
      enableHiding: false,
      enableSorting: false,
      minSize: 48,
      size: 48,
      cell: ({ row }) => (
        <ActionsCell
          item={row.original}
          onDelete={options.onDelete}
          onEdit={options.onEdit}
        />
      ),
    },
  ]
}

export const endpointColumns = createEndpointColumns()
