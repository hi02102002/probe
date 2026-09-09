import type { MockEndpointDetail, MockRequest } from '../_data'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  PaperPlaneTiltIcon,
  SlidersHorizontalIcon,
  TerminalIcon,
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from '@/components/ui/copy-button'
import { formatRelativeTime } from '@/lib/dayjs'

interface OverviewTabProps {
  endpoint: MockEndpointDetail
  onSelectTab: (tab: string) => void
  requests: MockRequest[]
}

export function OverviewTab({ endpoint, onSelectTab, requests }: OverviewTabProps) {
  const curlExample = `curl -X POST https://api.probe.dev/ep/${endpoint.token} \\
  -H "Content-Type: application/json" \\
  -d '{"event": "ping", "timestamp": "2026-09-02T22:45:00Z"}'`

  return (
    <div className="flex flex-col gap-6">
      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground text-xs">Total Requests</span>
              <PaperPlaneTiltIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-semibold text-2xl text-foreground tabular-nums">
                {endpoint.totalRequests.toLocaleString()}
              </span>
              <span className="font-medium text-emerald-600 text-xs dark:text-emerald-400">+12% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground text-xs">Success Rate</span>
              <CheckCircleIcon className="size-4 text-emerald-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-semibold text-2xl text-foreground tabular-nums">
                {endpoint.successRate}
                %
              </span>
              <span className="text-muted-foreground text-xs">22 errors</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground text-xs">Avg Response Time</span>
              <ClockIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-semibold text-2xl text-foreground tabular-nums">
                {endpoint.avgLatencyMs}
                ms
              </span>
              <span className="text-muted-foreground text-xs">p95: 58ms</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground text-xs">Active Rules</span>
              <SlidersHorizontalIcon className="size-4 text-primary" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-semibold text-2xl text-foreground tabular-nums">
                {endpoint.activeRulesCount}
              </span>
              <span className="text-muted-foreground text-xs">Custom response, Delay</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2-Column Section: Test cURL + Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left: Quick Ingest Test */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="size-4 text-primary" />
                  <CardTitle className="text-base">Test Webhook Delivery</CardTitle>
                </div>
                <CopyButton size="sm" text={curlExample} variant="outline" />
              </div>
              <CardDescription>
                Send a test request from your terminal or API client to verify this endpoint.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border bg-muted/40 p-3.5 font-mono text-foreground text-xs leading-relaxed overflow-x-auto">
                <pre>{curlExample}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Rules Summary Card */}
          <Card className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Configured Mock Rules</CardTitle>
                <CardDescription>Rules currently altering responses for this endpoint.</CardDescription>
              </div>
              <Button onClick={() => onSelectTab('rules')} size="sm" variant="outline">
                <span>Manage Rules</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground text-sm">Default Status Code Rule</span>
                  <span className="text-muted-foreground text-xs">Returns HTTP 200 with JSON payload</span>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground text-sm">Simulated Latency</span>
                  <span className="text-muted-foreground text-xs">Delays response by 500ms</span>
                </div>
                <Badge variant="warning">500ms Delay</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Recent Requests Feed */}
        <div className="lg:col-span-2">
          <Card className="h-full shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <CardDescription>Last captured webhook calls.</CardDescription>
              </div>
              <Button onClick={() => onSelectTab('requests')} size="sm" variant="ghost">
                <span>View all</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {requests.slice(0, 4).map(req => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/30 cursor-pointer"
                    onClick={() => onSelectTab('requests')}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={req.status >= 200 && req.status < 300 ? 'success' : 'destructive'}>
                        {req.status}
                      </Badge>
                      <div className="flex flex-col">
                        <span className="font-mono font-medium text-foreground text-xs">
                          {req.method}
                          {' '}
                          {req.path}
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          {formatRelativeTime(req.timestamp)}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-muted-foreground text-xs">
                      {req.durationMs}
                      ms
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
