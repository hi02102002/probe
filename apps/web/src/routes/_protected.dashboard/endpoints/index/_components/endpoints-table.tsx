'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { useQueryStates } from 'nuqs'
import { useMemo } from 'react'
import { DataTable, DataTableEmpty } from '@/components/ui/data-table'
import { endpointSearchParams } from '../_utils/search-params'
import { createEndpointColumns } from './endpoints-table-columns'
import { EndpointsToolbar } from './endpoints-table-toolbar'

export interface EndpointsTableProps {}

export function EndpointsTable(_props: EndpointsTableProps = {}) {
  const { endpointsQueryOptions } = useRouteContext({
    from: '/_protected/dashboard/endpoints/',
  })

  const [params] = useQueryStates(endpointSearchParams)

  const { data, isLoading } = useQuery({
    ...endpointsQueryOptions,
    placeholderData: keepPreviousData,
  })

  const columns = useMemo(() => createEndpointColumns(), [])

  return (
    <div className="flex flex-col gap-4">
      <EndpointsToolbar />
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        empty={(
          <DataTableEmpty
            description={
              params.query
                ? `No endpoints matching "${params.query}".`
                : 'Create your first endpoint to start capturing webhooks.'
            }
            title={params.query ? 'No results found' : 'No endpoints found'}
          />
        )}
        enableRowSelection={false}
        loading={isLoading && !data}
        pageCount={data?.pagination.totalPages ?? 1}
        rowCount={data?.pagination.totalCount ?? 0}
      />
    </div>
  )
}
