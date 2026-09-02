import type { Endpoint } from './endpoints-table-cells'
import type { ColumnDef } from '@/components/ui/data-table'
import { DataTableColumnHeader } from '@/components/ui/data-table'
import {
  ActionsCell,
  CreatedAtCell,
  EndpointNameCell,
  LastActiveCell,
  StatusCell,
  TokenCell,
} from './endpoints-table-cells'

export function createEndpointColumns(): ColumnDef<Endpoint>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Endpoint Name" />
      ),
      minSize: 160,
      cell: ({ row }) => <EndpointNameCell item={row.original} />,
    },
    {
      accessorKey: 'status',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      maxSize: 100,
      minSize: 85,
      size: 90,
      cell: ({ row }) => <StatusCell status={row.getValue('status')} />,
    },
    {
      accessorKey: 'token',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ingest URL" />
      ),
      maxSize: 300,
      minSize: 280,
      size: 320,
      cell: ({ row }) => <TokenCell token={row.getValue('token')} />,
    },
    {
      accessorKey: 'lastRequestAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Active" />
      ),
      maxSize: 110,
      minSize: 90,
      size: 100,
      cell: ({ row }) => (
        <LastActiveCell lastRequestAt={row.getValue('lastRequestAt')} />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      maxSize: 120,
      minSize: 100,
      size: 110,
      cell: ({ row }) => <CreatedAtCell createdAt={row.getValue('createdAt')} />,
    },
    {
      id: 'actions',
      enableHiding: false,
      enableSorting: false,
      maxSize: 40,
      minSize: 40,
      size: 40,
      cell: ({ row }) => <ActionsCell item={row.original} />,
    },
  ]
}

export const endpointColumns = createEndpointColumns()
