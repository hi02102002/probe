import type { ConnectionStatus, RequestSummary } from '../_types'
import { useInfiniteQuery, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { useQueryStates } from 'nuqs'
import { useMemo } from 'react'
import { requestSearchParams } from '../_utils/search-params'

function getConnectionStatus({
  isEndpointInactive,
  isEndpointPaused,
  isStreamError,
  streamFailureCount,
}: {
  readonly isEndpointInactive: boolean
  readonly isEndpointPaused: boolean
  readonly isStreamError: boolean
  readonly streamFailureCount: number
}): ConnectionStatus {
  if (isEndpointPaused) {
    return { label: 'Endpoint paused', tone: 'bg-warning' }
  }

  if (isEndpointInactive) {
    return { label: 'Endpoint inactive', tone: 'bg-muted-foreground' }
  }

  if (isStreamError) {
    return { label: 'Disconnected', tone: 'bg-destructive' }
  }

  if (streamFailureCount > 0) {
    return { label: 'Reconnecting', tone: 'bg-warning' }
  }

  return { label: 'Listening for webhooks', tone: 'bg-success' }
}

export function useRequestsFeed() {
  const { getEndpointByIdQueryOptions } = useRouteContext({
    from: '/_protected/dashboard/endpoints/$id',
  })
  const { data: endpoint } = useSuspenseQuery(getEndpointByIdQueryOptions)

  const { orpc, requestListOptions } = useRouteContext({
    from: '/_protected/dashboard/endpoints/$id/requests',
  })
  const [params] = useQueryStates(requestSearchParams)

  const isEndpointPaused = endpoint.status === 'paused'
  const isEndpointInactive = endpoint.status === 'inactive'

  const listQuery = useInfiniteQuery(requestListOptions)

  const streamQuery = useQuery(orpc.ingest.stream.experimental_streamedOptions({
    enabled: typeof window !== 'undefined' && endpoint.status === 'active',
    input: {
      params: {
        token: endpoint.token,
      },
    },
    queryFnOptions: {
      maxChunks: 100,
      refetchMode: 'reset',
    },
    retry: 3,
  }))

  const requests = useMemo(() => {
    const historicalRequests = listQuery.data?.pages.flatMap(page => page.items) ?? []
    const liveRequests: readonly RequestSummary[] = (streamQuery.data ?? [])
      .filter(event => event.endpointId === endpoint.id)
      .map(event => ({
        createdAt: event.createdAt,
        endpointId: event.endpointId,
        id: event.id,
        method: event.method,
        size: event.size,
        statusCode: event.statusCode,
        url: event.url,
      }))
      .reverse()

    const visibleLiveRequests = liveRequests.filter(request =>
      (!params.method || request.method === params.method)
      && (!params.query
        || request.id.toLowerCase().includes(params.query.toLowerCase())
        || request.url.toLowerCase().includes(params.query.toLowerCase())))

    const seen = new Set(visibleLiveRequests.map(request => request.id))

    return [
      ...visibleLiveRequests,
      ...historicalRequests.filter(request => !seen.has(request.id)),
    ]
  }, [endpoint.id, listQuery.data?.pages, params.method, params.query, streamQuery.data])

  const connection = getConnectionStatus({
    isEndpointInactive,
    isEndpointPaused,
    isStreamError: streamQuery.isError,
    streamFailureCount: streamQuery.failureCount,
  })

  return {
    connection,
    endpointId: endpoint.id,
    fetchNextPage: () => listQuery.fetchNextPage(),
    hasNextPage: Boolean(listQuery.hasNextPage),
    isEndpointPaused,
    isFetchingNextPage: listQuery.isFetchingNextPage,
    isListError: listQuery.isError,
    isListLoading: listQuery.isLoading,
    isStreamError: streamQuery.isError,
    requests,
    totalLoaded: requests.length,
  }
}
