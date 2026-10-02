import { useInfiniteQuery } from '@tanstack/react-query'
import { Link, useParams, useRouteContext } from '@tanstack/react-router'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelativeTime } from '@/lib/dayjs'

export function ForwardsTab() {
  const { id: endpointId } = useParams({ from: '/_protected/dashboard/endpoints/$id' })
  const { forwardListOptions } = useRouteContext({
    from: '/_protected/dashboard/endpoints/$id/forwards',
  })

  const forwardsQuery = useInfiniteQuery(forwardListOptions)
  const forwardLogs = forwardsQuery.data?.pages.flatMap(page => page.items) ?? []

  if (forwardsQuery.isPending) {
    return (
      <div className="mt-4 flex max-w-4xl flex-col gap-4">
        {[0, 1, 2, 3, 4].map(index => (
          <Skeleton key={index} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (forwardsQuery.isError) {
    return (
      <div className="mt-4 flex max-w-4xl flex-col gap-4">
        <Alert variant="error">
          <AlertTitle>Unable to load forwards</AlertTitle>
          <AlertDescription>
            We could not load the forwarding history for this endpoint. Please try again.
          </AlertDescription>
          <AlertAction>
            <Button
              loading={forwardsQuery.isFetching}
              onClick={() => void forwardsQuery.refetch()}
              size="sm"
              type="button"
              variant="outline"
            >
              Try again
            </Button>
          </AlertAction>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mt-4 flex max-w-4xl flex-col gap-4">
      <Card className="shadow-xs">
        <CardHeader className="flex-row items-center justify-between gap-4 p-4 pb-3 sm:p-6 sm:pb-4">
          <div>
            <CardTitle className="text-lg">Forwards</CardTitle>
            <CardDescription className="mt-1">
              Deliveries made automatically by the endpoint's forwarding rule, newest first.
            </CardDescription>
          </div>
          <Badge variant="outline">
            {forwardLogs.length}
            {' '}
            logs
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {forwardLogs.length === 0
            ? (
                <div className="flex min-h-40 flex-col items-center justify-center gap-1.5 p-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    No forwards yet.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Enable forwarding in the
                    {' '}
                    <Link
                      className="text-foreground underline underline-offset-4 hover:no-underline"
                      params={{ id: endpointId }}
                      to="/dashboard/endpoints/$id/rules"
                    >
                      Rules tab
                    </Link>
                    {' '}
                    to relay incoming requests to another destination.
                  </p>
                </div>
              )
            : (
                <div className="divide-y divide-border">
                  {forwardLogs.map(forwardLog => (
                    <div
                      key={forwardLog.id}
                      className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/20"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Badge variant={forwardLog.success ? 'success' : 'destructive'}>
                          {forwardLog.statusCode ?? 'ERR'}
                        </Badge>
                        <span className="font-semibold font-mono text-foreground text-xs">
                          {forwardLog.method}
                        </span>
                        <span
                          className="truncate font-mono text-muted-foreground text-xs"
                          title={forwardLog.targetUrl}
                        >
                          {forwardLog.targetUrl}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-3 font-mono text-[11px] text-muted-foreground">
                        {forwardLog.durationMs != null && (
                          <span>
                            {forwardLog.durationMs}
                            ms
                          </span>
                        )}
                        <span>{formatRelativeTime(forwardLog.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

          {forwardsQuery.hasNextPage && (
            <div className="p-3">
              <Button
                className="w-full"
                loading={forwardsQuery.isFetchingNextPage}
                onClick={() => forwardsQuery.fetchNextPage()}
                size="sm"
                variant="outline"
              >
                Load more
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
