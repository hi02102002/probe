import type { MockReplayLog, MockRequest } from '../_data'
import {
  ArrowClockwiseIcon,
  CheckCircleIcon,
  PaperPlaneTiltIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toastManager } from '@/components/ui/toast'
import { formatRelativeTime } from '@/lib/dayjs'
import { MOCK_REPLAY_LOGS } from '../_data'

interface ReplayTabProps {
  initialRequest?: MockRequest | null
}

export function ReplayTab({ initialRequest }: ReplayTabProps) {
  const [targetUrl, setTargetUrl] = useState('https://api.myapp.dev/api/webhooks/stripe')
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT'>('POST')
  const [payload, setPayload] = useState(
    initialRequest?.body
      ? typeof initialRequest.body === 'object'
        ? JSON.stringify(initialRequest.body, null, 2)
        : initialRequest.body
      : JSON.stringify(
          {
            id: 'evt_test_replay_99812',
            type: 'payment_intent.succeeded',
            data: { amount: 8900, status: 'succeeded' },
          },
          null,
          2,
        ),
  )
  const [isReplaying, setIsReplaying] = useState(false)
  const [replayLogs, setReplayLogs] = useState<MockReplayLog[]>(MOCK_REPLAY_LOGS)
  const [lastResponse, setLastResponse] = useState<{
    body: string
    durationMs: number
    status: number
  } | null>(null)

  async function handleSendReplay() {
    if (!targetUrl) {
      toastManager.add({ title: 'Please specify a target URL', type: 'error' })
      return
    }

    setIsReplaying(true)

    // Simulate network replay
    setTimeout(() => {
      setIsReplaying(false)
      const mockResult: MockReplayLog = {
        id: `rep_${Date.now()}`,
        originalRequestId: initialRequest?.id ?? 'manual_replay',
        targetUrl,
        status: 200,
        durationMs: Math.floor(Math.random() * 60) + 30,
        timestamp: new Date().toISOString(),
        method,
        success: true,
      }

      setReplayLogs(prev => [mockResult, ...prev])
      setLastResponse({
        status: 200,
        durationMs: mockResult.durationMs,
        body: JSON.stringify({ success: true, message: 'Webhook replayed successfully to target destination' }, null, 2),
      })

      toastManager.add({
        title: 'Replay successful (200 OK)',
        description: `Delivered to ${targetUrl} in ${mockResult.durationMs}ms`,
        type: 'success',
      })
    }, 600)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Replay Form */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <Card className="shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <ArrowClockwiseIcon className="size-5 text-primary" weight="bold" />
                <CardTitle className="text-base">Webhook Replay Engine</CardTitle>
              </div>
              <CardDescription>
                Resend captured webhook payloads to any destination endpoint, localhost tunnel, or staging server.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Target URL input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Target Destination URL</label>
                <div className="flex gap-2">
                  <select
                    className="h-9 rounded-lg border border-border bg-card px-2.5 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onChange={e => setMethod(e.target.value as 'GET' | 'POST' | 'PUT')}
                    value={method}
                  >
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="GET">GET</option>
                  </select>
                  <Input
                    className="font-mono text-xs flex-1"
                    onChange={e => setTargetUrl(e.target.value)}
                    placeholder="https://api.yourdomain.com/webhooks"
                    value={targetUrl}
                  />
                </div>
              </div>

              {/* Payload editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">JSON Body Payload</label>
                  {initialRequest && (
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Loaded from
                      {' '}
                      {initialRequest.id.slice(0, 14)}
                      ...
                    </span>
                  )}
                </div>
                <textarea
                  className="w-full rounded-lg border border-border bg-muted/40 p-3.5 font-mono text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[180px]"
                  onChange={e => setPayload(e.target.value)}
                  rows={8}
                  value={payload}
                />
              </div>

              {/* Trigger Replay button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Payload will be sent with headers preserved.
                </span>
                <Button
                  disabled={isReplaying}
                  loading={isReplaying}
                  onClick={handleSendReplay}
                >
                  <PaperPlaneTiltIcon className="size-4 shrink-0" weight="fill" />
                  <span>Send Replay</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Response result from last replay */}
          {lastResponse && (
            <Card className="border-primary/30 bg-primary/5 shadow-xs">
              <CardHeader className="py-3 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="size-4 text-emerald-500" weight="fill" />
                    <span className="font-semibold text-xs text-foreground">
                      Destination Response:
                      {' '}
                      {lastResponse.status}
                      {' '}
                      OK
                    </span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {lastResponse.durationMs}
                    ms
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="rounded-lg border border-border bg-card p-3 font-mono text-xs text-foreground overflow-x-auto">
                  <pre>{lastResponse.body}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Replay History & Audit Logs */}
        <div className="lg:col-span-5">
          <Card className="shadow-xs h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Replay History</CardTitle>
                  <CardDescription>Recent retry attempts and replay dispatches.</CardDescription>
                </div>
                <Badge variant="outline">
                  {replayLogs.length}
                  {' '}
                  logs
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[560px]">
              <div className="divide-y divide-border">
                {replayLogs.map(log => (
                  <div key={log.id} className="p-4 flex flex-col gap-1.5 transition-colors hover:bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={log.success ? 'success' : 'destructive'}>
                          {log.status}
                        </Badge>
                        <span className="font-mono font-semibold text-xs text-foreground">
                          {log.method}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {formatRelativeTime(log.timestamp)}
                      </span>
                    </div>

                    <div className="truncate font-mono text-xs text-muted-foreground" title={log.targetUrl}>
                      {log.targetUrl}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>
                        Source:
                        {' '}
                        {log.originalRequestId.slice(0, 16)}
                        ...
                      </span>
                      <span>
                        {log.durationMs}
                        ms
                      </span>
                    </div>
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
