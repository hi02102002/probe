import {
  ClockClockwiseIcon,
  LightningIcon,
  PlusIcon,
  PulseIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { getPlanLimits } from '@repo/utils'
import { useQuery } from '@tanstack/react-query'
import { Link, useRouteContext } from '@tanstack/react-router'
import { AppShell, PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/layouts/dashboard'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { getAuthSessionQueryOptions } from '@/features/auth/api/auth-session'
import { cn } from '@/lib/cn'
import { formatRelativeTime } from '@/lib/dayjs'
import { getRequestPath } from '../../endpoints/$id/requests/_utils/request-utils'
import { CreateEndpointDialog } from '../../endpoints/index/_components/create-endpoint-dialog'
import { RequestsTrendChart } from './requests-trend-chart'

function statusVariant(statusCode: string | null | undefined): 'destructive' | 'outline' | 'success' {
  if (statusCode == null) {
    return 'outline'
  }

  const status = Number(statusCode)

  return status >= 200 && status < 300 ? 'success' : 'destructive'
}

const METHOD_TONE_CLASSES = {
  DELETE: 'border-destructive/20 bg-destructive/10 text-destructive',
  GET: 'border-chart-4/20 bg-chart-4/10 text-chart-4',
  PATCH: 'border-chart-5/20 bg-chart-5/10 text-chart-5',
  POST: 'border-success/20 bg-success/10 text-success',
  PUT: 'border-warning/20 bg-warning/10 text-warning',
} as const

export function DashboardPage() {
  const { recentRequestsOptions, statsOptions, trendOptions } = useRouteContext({
    from: '/_protected/dashboard/',
  })

  const { data: session } = useQuery(getAuthSessionQueryOptions)
  const statsQuery = useQuery(statsOptions)
  const trendQuery = useQuery(trendOptions)
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
                  <StatCard
                    caption="across your workspace"
                    icon={StackIcon}
                    label="Endpoints"
                    tone="border-chart-1/20 bg-chart-1/10 text-chart-1"
                    value={statsQuery.data.stats.endpoints}
                  />
                  <StatCard
                    caption="accepting requests"
                    icon={PulseIcon}
                    label="Active"
                    tone="border-success/20 bg-success/10 text-success"
                    value={statsQuery.data.stats.activeEndpoints}
                  />
                  <StatCard
                    caption="captured webhooks"
                    icon={LightningIcon}
                    label="Requests (24h)"
                    tone="border-chart-2/20 bg-chart-2/10 text-chart-2"
                    value={statsQuery.data.stats.requests24h}
                  />
                  <StatCard
                    caption="captured webhooks"
                    icon={ClockClockwiseIcon}
                    label="Requests (7d)"
                    tone="border-chart-5/20 bg-chart-5/10 text-chart-5"
                    value={statsQuery.data.stats.requests7d}
                  />
                </div>
              )}

        {/* Trend + plan usage */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="shadow-xs lg:col-span-2">
            <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
              <div>
                <CardTitle className="text-base">Requests</CardTitle>
                <CardDescription className="mt-1">
                  Captured per hour · last 24 hours.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="border-t border-border p-4 pt-4 sm:p-6 sm:pt-4">
              {trendQuery.isPending
                ? <Skeleton className="h-28 w-full rounded-lg" />
                : trendQuery.isError
                  ? (
                      <Alert variant="error">
                        <AlertTitle>Unable to load trend</AlertTitle>
                        <AlertDescription>
                          We could not load your request trend. Please try again.
                        </AlertDescription>
                        <AlertAction>
                          <Button
                            loading={trendQuery.isFetching}
                            onClick={() => void trendQuery.refetch()}
                            size="sm"
                            type="button"
                            variant="outline"
                          >
                            Try again
                          </Button>
                        </AlertAction>
                      </Alert>
                    )
                  : <RequestsTrendChart points={trendQuery.data.points} />}
            </CardContent>
          </Card>

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
              <Progress value={usagePercent}>
                <ProgressTrack className="h-1.5">
                  <ProgressIndicator />
                </ProgressTrack>
              </Progress>
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
        </div>

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
                      <Empty className="min-h-48 border-0 py-10">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <PulseIcon className="size-5" weight="duotone" />
                          </EmptyMedia>
                          <EmptyTitle>
                            No requests captured yet
                          </EmptyTitle>
                          <EmptyDescription>
                            Send a webhook to one of your endpoints and it will appear here.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <CreateEndpointDialog
                            trigger={(
                              <Button
                                data-umami-event="Empty state new endpoint clicked"
                                data-umami-event-button-name="dashboard__dashboard__empty-new-endpoint"
                                variant="outline"
                              >
                                <PlusIcon />
                                New endpoint
                              </Button>
                            )}
                          />
                        </EmptyContent>
                      </Empty>
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
                                <span
                                  className={cn(
                                    'rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide',
                                    METHOD_TONE_CLASSES[request.method],
                                  )}
                                >
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

interface StatCardProps {
  caption: string
  icon: React.ComponentType<React.ComponentProps<typeof StackIcon>>
  label: string
  tone: string
  value: number
}

function StatCard({ caption, icon: Icon, label, tone, value }: StatCardProps) {
  return (
    <Card className="shadow-xs transition-transform duration-200 hover:-translate-y-0.5">
      <CardHeader className="p-4 pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl tabular-nums tracking-tight">
          {value}
        </CardTitle>
        <CardAction>
          <span className={cn('flex size-8 items-center justify-center rounded-lg border', tone)}>
            <Icon className="size-4.5" weight="duotone" />
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <span className="text-muted-foreground text-xs">
          {caption}
        </span>
      </CardContent>
    </Card>
  )
}
