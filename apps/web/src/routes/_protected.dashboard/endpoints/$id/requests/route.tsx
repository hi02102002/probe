import { createFileRoute } from '@tanstack/react-router'
import { RequestInspector } from './_components/inspector/request-inspector'
import { RequestList } from './_components/list/request-list'
import { RequestToolbar } from './_components/toolbar/request-toolbar'
import { useRequestsFeed } from './_hooks/use-requests-feed'
import { useSelectedRequest } from './_hooks/use-selected-request'
import { requestSearchSchema } from './_utils/search-params'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints/$id/requests',
)({
  component: RequestsRouteComponent,
  validateSearch: requestSearchSchema,
  loaderDeps: ({ search }) => ({
    method: search.method ?? undefined,
    query: search.query || undefined,
    requestId: search.requestId || undefined,
  }),
  context: ({ context, deps, params }) => {
    const requestListOptions = context.orpc.request.list.infiniteOptions({
      getNextPageParam: lastPage => lastPage.nextCursor,
      initialPageParam: null,
      input: cursor => ({
        params: {
          endpointId: params.id,
        },
        query: {
          cursor: cursor ?? undefined,
          limit: 25,
          method: deps.method,
          query: deps.query,
        },
      }),
    })

    const requestDetailOptions = deps.requestId
      ? context.orpc.request.getById.queryOptions({
          input: {
            params: {
              endpointId: params.id,
              requestId: deps.requestId,
            },
          },
        })
      : undefined

    return {
      requestListOptions,
      requestDetailOptions,
    }
  },
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureInfiniteQueryData(context.requestListOptions),
      context.requestDetailOptions
        ? context.queryClient.ensureQueryData(context.requestDetailOptions)
        : Promise.resolve(),
    ])
  },
})

function RequestsRouteComponent() {
  const {
    connection,
    endpointId,
    isListError,
    isStreamError,
    requests,
    totalLoaded,
  } = useRequestsFeed()

  const {
    isLoading: isDetailLoading,
    request: selectedRequest,
  } = useSelectedRequest(endpointId, requests[0]?.id)

  return (
    <div className="mt-4 flex flex-col gap-4">
      <RequestToolbar
        connection={connection}
        isStreamError={isStreamError}
        totalLoaded={totalLoaded}
      />

      {isListError
        ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive-foreground text-sm">
              Captured requests could not be loaded. Refresh the page to try again.
            </div>
          )
        : (
            <div className="grid min-h-145 grid-cols-1 gap-4 lg:grid-cols-12">
              <RequestList />
              <RequestInspector
                endpointId={endpointId}
                isLoading={isDetailLoading}
                request={selectedRequest}
              />
            </div>
          )}
    </div>
  )
}
