import {
  ArrowClockwiseIcon,
  CheckCircleIcon,
  PaperPlaneTiltIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { skipToken, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { useParams, useRouteContext } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toastManager } from '@/components/ui/toast'
import { formatRelativeTime } from '@/lib/dayjs'

type ReplayMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const METHODS: ReplayMethod[] = ['POST', 'GET', 'PUT', 'PATCH', 'DELETE']

function formatBody(value: unknown): string {
  if (value == null) {
    return ''
  }

  return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
}

export interface ReplayTabProps {
  sourceRequestId?: string
}

export function ReplayTab({ sourceRequestId }: ReplayTabProps) {
  const { id: endpointId } = useParams({ from: '/_protected/dashboard/endpoints/$id' })
  const {
    orpc,
    queryClient,
    replayListOptions,
    sourceRequestOptions,
  } = useRouteContext({ from: '/_protected/dashboard/endpoints/$id/replay' })

  const [method, setMethod] = useState<ReplayMethod>('POST')
  const [targetUrl, setTargetUrl] = useState('')
  const [payload, setPayload] = useState('')

  const { data: sourceRequest } = useQuery(
    sourceRequestOptions
    ?? { queryKey: ['replay-source-request', 'disabled'], queryFn: skipToken },
  )

  const prefilledRequestRef = useRef<string | null>(null)

  useEffect(() => {
    if (sourceRequest && prefilledRequestRef.current !== sourceRequest.id) {
      prefilledRequestRef.current = sourceRequest.id
      setMethod(sourceRequest.method)

      if (sourceRequest.reqBody != null) {
        setPayload(formatBody(sourceRequest.reqBody))
      }
    }
  }, [sourceRequest])

  const historyQuery = useInfiniteQuery(replayListOptions)
  const replayLogs = historyQuery.data?.pages.flatMap(page => page.items) ?? []

  const replayMutation = useMutation(
    orpc.replay.send.mutationOptions({
      onSuccess: async ({ log }) => {
        await queryClient.invalidateQueries({
          queryKey: orpc.replay.list.key(),
        })

        toastManager.add({
          type: log.success ? 'success' : 'error',
          title: log.success
            ? `Replay successful (${log.statusCode} OK)`
            : 'Replay failed',
          description: log.error
            ?? `Delivered to ${log.targetUrl} in ${log.durationMs}ms`,
        })
      },
    }),
  )

  const lastResponse = replayMutation.data?.log

  async function handleSendReplay() {
    if (!targetUrl.trim()) {
      toastManager.add({ title: 'Please specify a target URL', type: 'error' })
      return
    }

    try {
      await replayMutation.mutateAsync({
        body: {
          method,
          payload: method === 'GET'
            ? undefined
            : payload.trim() ? payload : undefined,
          requestId: sourceRequestId,
          url: targetUrl.trim(),
        },
        params: { endpointId },
      })
    }
    catch (error) {
      toastManager.add({
        type: 'error',
        title: 'Replay rejected',
        description: error instanceof Error
          ? error.message
          : 'The replay could not be sent.',
      })
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Column: Replay Form */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          <Card className="shadow-xs">
            <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground">
                  <ArrowClockwiseIcon className="size-4.5" weight="duotone" />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <CardTitle className="text-base">Webhook Replay Engine</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Resend a captured webhook payload to any public destination URL, such as a
                    staging server or a tunnel to your local machine.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-4 pt-0 sm:p-6 sm:pt-0">
              {/* Target URL & Method */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr] sm:gap-3.5">
                <Field className="w-full gap-1.5">
                  <FieldLabel htmlFor="replay-method">HTTP Method</FieldLabel>
                  <Select
                    items={METHODS.map(value => ({ label: value, value }))}
                    onValueChange={value => setMethod((value as ReplayMethod) ?? 'POST')}
                    value={method}
                  >
                    <SelectTrigger className="w-full min-w-0" id="replay-method">
                      <SelectValue placeholder="POST" />
                    </SelectTrigger>
                    <SelectPopup>
                      {METHODS.map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                </Field>

                <Field className="w-full gap-1.5">
                  <FieldLabel htmlFor="replay-target-url">Target Destination URL</FieldLabel>
                  <Input
                    className="font-mono text-xs"
                    id="replay-target-url"
                    onChange={e => setTargetUrl(e.target.value)}
                    placeholder="https://api.yourdomain.com/webhooks"
                    type="url"
                    value={targetUrl}
                  />
                </Field>
              </div>

              {/* Payload editor */}
              <Field className="w-full gap-1.5">
                <div className="flex w-full items-center justify-between">
                  <FieldLabel htmlFor="replay-payload">JSON Body Payload</FieldLabel>
                  {sourceRequest && (
                    <span className="font-mono text-[11px] text-muted-foreground">
                      Loaded from
                      {' '}
                      {sourceRequest.id.slice(0, 14)}
                      ...
                    </span>
                  )}
                </div>
                <Textarea
                  className="min-h-[180px] font-mono text-xs leading-relaxed"
                  disabled={method === 'GET'}
                  id="replay-payload"
                  onChange={e => setPayload(e.target.value)}
                  placeholder={method === 'GET' ? 'GET requests have no body' : '{"event": "payload"}'}
                  rows={8}
                  value={payload}
                />
              </Field>

              {/* Trigger Replay button */}
              <div className="flex flex-col gap-3 pt-2">
                <p className="text-muted-foreground text-xs">
                  Only the payload is sent — original headers are not forwarded. JSON payloads are
                  sent with a content-type of application/json.
                </p>
                <div className="flex justify-end">
                  <Button
                    data-umami-event="Replay sent"
                    data-umami-event-button-name="dashboard__replay-tab__send-replay"
                    disabled={replayMutation.isPending}
                    loading={replayMutation.isPending}
                    onClick={handleSendReplay}
                    type="button"
                  >
                    <PaperPlaneTiltIcon className="size-4 shrink-0" weight="fill" />
                    <span>Send Replay</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response result from last replay */}
          {lastResponse && (
            <Card
              className={`shadow-xs ${lastResponse.success
                ? 'border-primary/30 bg-primary/5'
                : 'border-destructive/30 bg-destructive/5'}`}
            >
              <CardHeader className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {lastResponse.success
                      ? (
                          <CheckCircleIcon className="size-4 text-emerald-500" weight="fill" />
                        )
                      : (
                          <XCircleIcon className="size-4 text-destructive" weight="fill" />
                        )}
                    <span className="font-semibold text-xs text-foreground">
                      Destination Response:
                      {' '}
                      {lastResponse.statusCode ?? lastResponse.error ?? 'No response'}
                    </span>
                  </div>
                  {lastResponse.durationMs != null && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {lastResponse.durationMs}
                      ms
                    </span>
                  )}
                </div>
              </CardHeader>
              {lastResponse.resBody != null && (
                <CardContent className="p-4 pt-0">
                  <div className="overflow-x-auto rounded-lg border border-border bg-card p-3 font-mono text-xs text-foreground">
                    <pre>{formatBody(lastResponse.resBody)}</pre>
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>

        {/* Right Column: Replay History & Audit Logs */}
        <div className="lg:col-span-5">
          <Card className="flex h-full flex-col shadow-xs">
            <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
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
            <CardContent className="flex-1 overflow-y-auto p-0 max-h-[560px]">
              {replayLogs.length === 0
                ? (
                    <div className="flex h-full min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
                      No replays yet. Send your first replay to see it here.
                    </div>
                  )
                : (
                    <div className="divide-y divide-border">
                      {replayLogs.map(log => (
                        <div key={log.id} className="flex flex-col gap-1.5 p-4 transition-colors hover:bg-muted/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={log.success ? 'success' : 'destructive'}>
                                {log.statusCode ?? 'ERR'}
                              </Badge>
                              <span className="font-mono font-semibold text-xs text-foreground">
                                {log.method}
                              </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                              {formatRelativeTime(log.createdAt)}
                            </span>
                          </div>

                          <div className="truncate font-mono text-xs text-muted-foreground" title={log.targetUrl}>
                            {log.targetUrl}
                          </div>

                          <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                            <span>
                              Source:
                              {' '}
                              {log.originalRequestId
                                ? `${log.originalRequestId.slice(0, 16)}...`
                                : 'manual'}
                            </span>
                            <span>
                              {log.durationMs != null ? `${log.durationMs}ms` : '—'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

              {historyQuery.hasNextPage && (
                <div className="p-3">
                  <Button
                    className="w-full"
                    loading={historyQuery.isFetchingNextPage}
                    onClick={() => historyQuery.fetchNextPage()}
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
      </div>
    </div>
  )
}
