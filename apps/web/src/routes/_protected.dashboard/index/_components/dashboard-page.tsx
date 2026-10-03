import { PlusIcon, PulseIcon } from '@phosphor-icons/react'
import { getPlanLimits } from '@repo/utils'
import { useQuery } from '@tanstack/react-query'
import { Link, useRouteContext } from '@tanstack/react-router'
import { AppShell, PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/layouts/dashboard'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getAuthSessionQueryOptions } from '@/features/auth/api/auth-session'
import { formatRelativeTime } from '@/lib/dayjs'
import { getRequestPath } from '../../endpoints/$id/requests/_utils/request-utils'
import { CreateEndpointDialog } from '../../endpoints/index/_components/create-endpoint-dialog'

function statusVariant(statusCode: string | null | undefined): 'destructive' | 'outline' | 'success' {
  if (statusCode == null) {
    return 'outline'
  }

  const status = Number(statusCode)

  return status >= 200 && status < 300 ? 'success' : 'destructive'
}

export function DashboardPage() {
  const { recentRequestsOptions, statsOptions } = useRouteContext({
    from: '/_protected/dashboard/',
  })

  const { data: session } = useQuery(getAuthSessionQueryOptions)
  const statsQuery = useQuery(statsOptions)
  const recentQuery = useQuery(recentRequestsOptions)

  const plan = session?.user.plan === 'premium' ? 'premium' : 'free'
  const limits = getPlanLimits(plan)
  const endpointsUsed = statsQuery.data?.stats.endpoints ?? 0
  const usagePercent = Math.min(100, Math.round((endpointsUsed / limits.maxEndpoints) * 100))
  const recentRequests = recentQuery.data?.items ?? []

  return (
    <AppShell>
      <div className="flex items-start justify-between gap-4">
        <PageHeader>
          <PageHeaderTitle>
            Dashboard
          </PageHeaderTitle>
          <PageHeaderDescription>
            Overview of your endpoints and captured webhook activity.
          </PageHeaderDescription>
        </PageHeader>
        <CreateEndpointDialog
          trigger={(
            <Button
              data-umami-event="New endpoint button clicked"
              data-umami-event-button-name="dashboard__dashboard__new-endpoint"
              size="sm"
            >
              <PlusIcon />
              New endpoint
            </Button>
          )}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {/* Stats */}
        {statsQuery.isPending
          ? (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[0, 1, 2, 3].map(index => (
                  <Skeleton className="h-24 w-full rounded-xl" key={index} />
                ))}
              </div>
            )
          : statsQuery.isError
            ? (
                <Alert variant="error">
                  <AlertTitle>Unable to load stats</AlertTitle>
                  <AlertDescription>
                    We could not load your usage stats. Please try again.
                  </AlertDescription>
                  <AlertAction>
                    <Button
                      loading={statsQuery.isFetching}
                      onClick={() => void statsQuery.refetch()}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      Try again
                    </Button>
                  </AlertAction>
                </Alert>
              )
            : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <Card className="shadow-xs">
                    <CardHeader className="p-4 pb-2">
                      <CardDescription>Endpoints</CardDescription>
                      <CardTitle className="text-3xl">
                        {statsQuery.data.stats.endpoints}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <span className="text-muted-foreground text-xs">
                        across your workspace
                      </span>
                    </CardContent>
                  </Card>
                  <Card className="shadow-xs">
                    <CardHeader className="p-4 pb-2">
                      <CardDescription>Active</CardDescription>
                      <CardTitle className="text-3xl">
                        {statsQuery.data.stats.activeEndpoints}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <span className="text-muted-foreground text-xs">
                        accepting requests
                      </span>
                    </CardContent>
                  </Card>
                  <Card className="shadow-xs">
                    <CardHeader className="p-4 pb-2">
                      <CardDescription>Requests (24h)</CardDescription>
                      <CardTitle className="text-3xl">
                        {statsQuery.data.stats.requests24h}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <span className="text-muted-foreground text-xs">
                        captured webhooks
                      </span>
                    </CardContent>
                  </Card>
                  <Card className="shadow-xs">
                    <CardHeader className="p-4 pb-2">
                      <CardDescription>Requests (7d)</CardDescription>
                      <CardTitle className="text-3xl">
                        {statsQuery.data.stats.requests7d}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <span className="text-muted-foreground text-xs">
                        captured webhooks
                      </span>
                    </CardContent>
                  </Card>
                </div>
              )}

        {/* Plan usage */}
        <Card className="shadow-xs">
          <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Plan usage</CardTitle>
                <Badge variant={plan === 'premium' ? 'success' : 'outline'}>
                  {plan === 'premium' ? 'Premium' : 'Free'}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                Limits applied to your account.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 border-t border-border p-4 pt-4 sm:p-6 sm:pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Endpoints
              </span>
              <span className="font-medium">
                {endpointsUsed}
                {' '}
                /
                {' '}
                {limits.maxEndpoints}
              </span>
            </div>
            <div aria-hidden="true" className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Request retention
              </span>
              <span className="font-medium">
                {limits.retentionDays}
                {' '}
                {limits.retentionDays === 1 ? 'day' : 'days'}
              </span>
            </div>
            {plan === 'free' && (
              <Link
                className="font-medium text-primary hover:underline"
                data-umami-link-event="Dashboard manage plan clicked"
                data-umami-event-button-name="dashboard__dashboard__manage-plan"
                to="/dashboard/billing"
              >
                Manage plan
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="shadow-xs">
          <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
            <div>
              <CardTitle className="text-base">Recent activity</CardTitle>
              <CardDescription className="mt-1">
                Latest captured requests across all your endpoints.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentQuery.isPending
              ? (
                  <div className="flex flex-col gap-2 p-4">
                    {[0, 1, 2].map(index => (
                      <Skeleton className="h-11 w-full rounded-lg" key={index} />
                    ))}
                  </div>
                )
              : recentQuery.isError
                ? (
                    <div className="p-4">
                      <Alert variant="error">
                        <AlertTitle>Unable to load recent requests</AlertTitle>
                        <AlertDescription>
                          We could not load your recent activity. Please try again.
                        </AlertDescription>
                        <AlertAction>
                          <Button
                            loading={recentQuery.isFetching}
                            onClick={() => void recentQuery.refetch()}
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
                : recentRequests.length === 0
                  ? (
                      <div className="flex min-h-32 flex-col items-center justify-center gap-1.5 p-6 text-center">
                        <PulseIcon className="size-5 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                          No requests captured yet.
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Send a webhook to one of your endpoints to see it here.
                        </p>
                      </div>
                    )
                  : (
                      <div className="divide-y divide-border">
                        {recentRequests.map(request => (
                          <Link
                            data-umami-link-event="Open recent request"
                            data-umami-event-button-name="dashboard__dashboard__open-recent-request"
                            key={request.id}
                            params={{ id: request.endpointId }}
                            search={{ requestId: request.id }}
                            to="/dashboard/endpoints/$id/requests"
                          >
                            <div className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/20">
                              <div className="flex min-w-0 items-center gap-2">
                                <Badge variant={statusVariant(request.statusCode)}>
                                  {request.statusCode ?? '—'}
                                </Badge>
                                <span className="font-semibold font-mono text-foreground text-xs">
                                  {request.method}
                                </span>
                                <span className="truncate text-muted-foreground text-xs">
                                  {request.endpointName}
                                </span>
                                <span className="hidden truncate font-mono text-muted-foreground text-xs sm:inline">
                                  {getRequestPath(request.url)}
                                </span>
                              </div>
                              <span className="shrink-0 text-muted-foreground text-[11px]">
                                {formatRelativeTime(request.createdAt)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
