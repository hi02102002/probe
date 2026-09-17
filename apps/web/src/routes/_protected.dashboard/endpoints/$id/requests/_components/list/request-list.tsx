import type { VListHandle } from 'virtua'
import { getRouteApi, Link } from '@tanstack/react-router'
import { useCallback, useRef } from 'react'
import { VList } from 'virtua'
import { Spinner } from '@/components/ui/spinner'
import { useRequestsFeed } from '../../_hooks/use-requests-feed'
import { RequestListEmpty } from './request-list-empty'
import { RequestListItem } from './request-list-item'
import { RequestListSkeleton } from './request-list-skeleton'

const requestsRoute = getRouteApi('/_protected/dashboard/endpoints/$id/requests')

export function RequestList() {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isListLoading,
    requests,
  } = useRequestsFeed()
  const search = requestsRoute.useSearch()
  const vlistRef = useRef<VListHandle>(null)

  const selectedId = search.requestId ?? requests[0]?.id

  const handleScroll = useCallback(
    (offset: number) => {
      if (!hasNextPage || isFetchingNextPage || !vlistRef.current) {
        return
      }

      const { scrollSize, viewportSize } = vlistRef.current
      if (offset + viewportSize >= scrollSize - 200) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  )

  const renderContent = () => {
    if (isListLoading && !requests.length) {
      return (
        <div className="flex-1 divide-y divide-border overflow-y-auto">
          <RequestListSkeleton />
        </div>
      )
    }

    if (!requests.length) {
      return <RequestListEmpty />
    }

    return (
      <VList
        className="flex-1 min-h-0 overflow-y-auto"
        onScroll={handleScroll}
        ref={vlistRef}
        ssrCount={Math.min(requests.length, 25)}
      >
        {requests.map(request => (
          <RequestListItem
            isSelected={request.id === selectedId}
            key={request.id}
            render={(
              <Link
                data-umami-link-event="Select webhook request"
                data-umami-event-button-name="dashboard__requests__select-request"
                data-umami-event-request-id={request.id}
                from="/dashboard/endpoints/$id/requests"
                search={prev => ({ ...prev, requestId: request.id })}
              />
            )}
            request={request}
          />
        ))}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center p-4" key="fetching-next-page">
            <Spinner className="size-4 text-muted-foreground" />
          </div>
        )}
      </VList>
    )
  }

  return (
    <section
      aria-label="Captured requests"
      className="flex min-h-80 flex-col overflow-hidden rounded-xl border border-border bg-card lg:col-span-4 lg:max-h-170"
    >
      <div className="border-b border-border bg-muted/30 px-3.5 py-2.5 text-muted-foreground text-xs font-medium">
        Captured events
      </div>
      {renderContent()}
    </section>
  )
}
