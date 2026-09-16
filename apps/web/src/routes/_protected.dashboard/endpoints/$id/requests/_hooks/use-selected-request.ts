import { skipToken, useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'

const requestsRoute = getRouteApi('/_protected/dashboard/endpoints/$id/requests')

export function useSelectedRequest(endpointId: string, fallbackId?: string) {
  const { orpc } = requestsRoute.useRouteContext()
  const search = requestsRoute.useSearch()
  const navigate = requestsRoute.useNavigate()

  const selectedId = search.requestId ?? fallbackId

  const detailQuery = useQuery(orpc.request.getById.queryOptions({
    input: selectedId
      ? {
          params: {
            endpointId,
            requestId: selectedId,
          },
        }
      : skipToken,
  }))

  const setSelectedId = (requestId: string | null) => {
    navigate({
      search: prev => ({
        ...prev,
        requestId: requestId ?? undefined,
      }),
    })
  }

  return {
    isLoading: detailQuery.isLoading,
    request: detailQuery.data,
    selectedId,
    setSelectedId,
  }
}
