import {
  ArrowCounterClockwiseIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  FlaskIcon,
  PaperPlaneTiltIcon,
  TerminalIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toastManager } from '@/components/ui/toast'
import { cn } from '@/lib/cn'

interface TestSectionProps {
  endpointId: string
  ingestUrl: string
}

type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

interface PayloadPreset {
  id: string
  label: string
  payload: string
}

const PRESETS: PayloadPreset[] = [
  {
    id: 'ping',
    label: 'Ping Event',
    payload: JSON.stringify(
      {
        event: 'probe.ping',
        message: 'Hello from Probe Webhook Tester!',
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    ),
  },
  {
    id: 'stripe',
    label: 'Stripe Payment Success',
    payload: JSON.stringify(
      {
        data: {
          object: {
            amount: 4900,
            currency: 'usd',
            customer: 'cus_test_98765',
            id: 'pi_3N0123456789',
            status: 'succeeded',
          },
        },
        id: 'evt_test_3N0123456789',
        object: 'event',
        type: 'payment_intent.succeeded',
      },
      null,
      2,
    ),
  },
  {
    id: 'github',
    label: 'GitHub Push Event',
    payload: JSON.stringify(
      {
        head_commit: {
          id: '8a1b2c3',
          message: 'feat: test webhook ingestion delivery',
        },
        ref: 'refs/heads/main',
        repository: {
          full_name: 'probe/probe-app',
          name: 'probe',
        },
        sender: {
          login: 'octocat',
        },
      },
      null,
      2,
    ),
  },
  {
    id: 'custom',
    label: 'Custom JSON',
    payload: JSON.stringify(
      {
        data: {
          key: 'value',
        },
        event: 'custom.event',
      },
      null,
      2,
    ),
  },
]

export function TestSection({ endpointId, ingestUrl }: TestSectionProps) {
  const queryClient = useQueryClient()
  const [method, setMethod] = useState<HttpMethod>('POST')
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ping')
  const [payloadText, setPayloadText] = useState<string>(PRESETS[0]?.payload ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<{
    body: string
    durationMs: number
    ok: boolean
    status: number
    statusText: string
  } | null>(null)

  const handleSelectPreset = (presetId: string | null) => {
    if (!presetId)
      return
    setSelectedPresetId(presetId)
    const found = PRESETS.find(p => p.id === presetId)
    if (found) {
      setPayloadText(found.payload)
    }
  }

  const handleResetPayload = () => {
    const found = PRESETS.find(p => p.id === selectedPresetId)
    if (found) {
      setPayloadText(found.payload)
    }
  }

  const curlCommand = useMemo(() => {
    if (method === 'GET' || method === 'DELETE') {
      return `curl -X ${method} "${ingestUrl}"`
    }
    const singleLinePayload = payloadText.replace(/\n\s*/g, ' ').trim()
    return `curl -X ${method} "${ingestUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${singleLinePayload.replace(/'/g, '\'\\\'\'')}'`
  }, [ingestUrl, method, payloadText])

  const handleSendTest = async () => {
    setIsLoading(true)
    const startTime = performance.now()

    try {
      const isBodyAllowed = method !== 'GET' && method !== 'DELETE'
      const res = await fetch(ingestUrl, {
        body: isBodyAllowed ? payloadText : undefined,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Probe-Tester/1.0',
        },
        method,
      })

      const durationMs = Math.round(performance.now() - startTime)
      let text = ''
      try {
        const json = await res.json()
        text = JSON.stringify(json, null, 2)
      }
      catch {
        text = await res.text()
      }

      const result = {
        body: text,
        durationMs,
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
      }
      setLastResult(result)

      if (res.ok) {
        toastManager.add({
          description: `HTTP ${res.status} ${res.statusText || 'OK'} (${durationMs}ms) — Logged in Requests tab.`,
          title: 'Test webhook delivered!',
          type: 'success',
        })
        // Invalidate requests query so feed updates immediately
        queryClient.invalidateQueries()
      }
      else {
        toastManager.add({
          description: `HTTP ${res.status} ${res.statusText || 'Error'} (${durationMs}ms)`,
          title: 'Webhook delivery returned error',
          type: 'error',
        })
      }
    }
    catch (err) {
      const durationMs = Math.round(performance.now() - startTime)
      const message = err instanceof Error ? err.message : 'Network request failed'
      setLastResult({
        body: message,
        durationMs,
        ok: false,
        status: 0,
        statusText: 'Network Error',
      })
      toastManager.add({
        description: message,
        title: 'Failed to send test webhook',
        type: 'error',
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  const isBodyDisabled = method === 'GET' || method === 'DELETE'

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Interactive Webhook Sender */}
      <div className="flex flex-col gap-4 lg:col-span-7">
        <Card className="shadow-xs">
          <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground">
                  <FlaskIcon className="size-4.5" weight="duotone" />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base">Test Webhook Delivery</CardTitle>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Send simulated webhook events directly to your ingest endpoint to test capturing, headers, and payloads.
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-4 pt-0 sm:p-6 sm:pt-0">
            {/* Method & Preset Selectors */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr] sm:gap-3.5">
              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="font-medium text-muted-foreground text-xs">HTTP Method</label>
                <Select
                  items={[
                    { label: 'POST', value: 'POST' },
                    { label: 'GET', value: 'GET' },
                    { label: 'PUT', value: 'PUT' },
                    { label: 'PATCH', value: 'PATCH' },
                    { label: 'DELETE', value: 'DELETE' },
                  ]}
                  onValueChange={val => setMethod((val as HttpMethod) ?? 'POST')}
                  value={method}
                >
                  <SelectTrigger className="w-full min-w-0">
                    <SelectValue placeholder="POST" />
                  </SelectTrigger>
                  <SelectPopup>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectPopup>
                </Select>
              </div>

              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="font-medium text-muted-foreground text-xs">Payload Template</label>
                <Select
                  disabled={isBodyDisabled}
                  items={PRESETS.map(p => ({ label: p.label, value: p.id }))}
                  onValueChange={handleSelectPreset}
                  value={selectedPresetId}
                >
                  <SelectTrigger className="w-full min-w-0">
                    <SelectValue placeholder="Choose a preset" />
                  </SelectTrigger>
                  <SelectPopup>
                    {PRESETS.map(preset => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectPopup>
                </Select>
              </div>
            </div>

            {/* Request Payload Editor */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-medium text-muted-foreground text-xs">JSON Payload</label>
                {!isBodyDisabled && (
                  <button
                    className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                    data-umami-event="Reset test payload"
                    data-umami-event-button-name="dashboard__test__reset-payload"
                    onClick={handleResetPayload}
                    type="button"
                  >
                    <ArrowCounterClockwiseIcon className="size-3" />
                    <span>Reset template</span>
                  </button>
                )}
                {isBodyDisabled && (
                  <span className="text-[11px] text-muted-foreground italic">
                    Body not applicable for
                    {' '}
                    {method}
                    {' '}
                    requests
                  </span>
                )}
              </div>
              <Textarea
                className={cn(
                  'min-h-[160px] font-mono text-xs leading-relaxed',
                  isBodyDisabled && 'opacity-50 cursor-not-allowed',
                )}
                disabled={isBodyDisabled}
                onChange={e => setPayloadText(e.target.value)}
                placeholder="{}"
                rows={8}
                value={isBodyDisabled ? `// Body is omitted for ${method} requests` : payloadText}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:gap-2.5">
              <Button
                className="w-full sm:w-auto"
                data-umami-event="Send test webhook request"
                data-umami-event-button-name="dashboard__test__send-request"
                data-umami-event-method={method}
                disabled={isLoading}
                loading={isLoading}
                onClick={handleSendTest}
                size="default"
                type="button"
              >
                <PaperPlaneTiltIcon className="size-4" weight="duotone" />
                <span>Send Test Request</span>
              </Button>

              <Button
                className="w-full sm:w-auto"
                data-umami-event="Navigate to requests tab"
                data-umami-event-button-name="dashboard__test__go-to-requests"
                render={(
                  <Link
                    params={{ id: endpointId }}
                    to="/dashboard/endpoints/$id/requests"
                  />
                )}
                size="default"
                variant="outline"
              >
                <span>Go to Requests</span>
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>

            {/* Last Execution Result */}
            {lastResult && (
              <div
                className={cn(
                  'mt-2 flex flex-col gap-2 rounded-xl border p-3.5 text-xs',
                  lastResult.ok
                    ? 'border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-950/20'
                    : 'border-destructive/30 bg-destructive/5 dark:bg-destructive/10',
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {lastResult.ok
                      ? (
                          <CheckCircleIcon className="size-4 text-emerald-500" weight="fill" />
                        )
                      : (
                          <WarningCircleIcon className="size-4 text-destructive" weight="fill" />
                        )}
                    <span className="font-semibold text-foreground">
                      Response:
                      {' '}
                      {lastResult.status}
                      {' '}
                      {lastResult.statusText}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-muted-foreground text-[11px]">
                    <ClockIcon className="size-3" />
                    <span>
                      {lastResult.durationMs}
                      ms
                    </span>
                  </div>
                </div>
                {lastResult.body && (
                  <pre className="max-h-36 overflow-x-auto rounded-lg border border-border/50 bg-background/80 p-2.5 font-mono text-[11px] text-foreground leading-relaxed">
                    {lastResult.body}
                  </pre>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Terminal / cURL Command & Quick Start Guide */}
      <div className="flex flex-col gap-4 lg:col-span-5">
        {/* cURL Command Card */}
        <Card className="shadow-xs">
          <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground">
                <TerminalIcon className="size-4.5" weight="duotone" />
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <CardTitle className="text-base">cURL Command</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Or run this command directly from your terminal or CI/CD pipeline:
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <CodeBlock language="bash" lineNumbers={false} showCopy showHeader={false}>
              {curlCommand}
            </CodeBlock>
          </CardContent>
        </Card>

        {/* 3 Steps Guide */}
        <Card className="shadow-xs">
          <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-3">
            <CardTitle className="font-semibold text-sm">How Webhook Ingest Works</CardTitle>
            <CardDescription className="text-xs">
              Follow these simple steps to integrate this endpoint:
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 p-4 pt-0 text-xs sm:p-6 sm:pt-0">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-[11px] text-primary">
                1
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-foreground">Configure Webhook URL</span>
                <span className="text-muted-foreground leading-relaxed">
                  Paste the Ingest URL into Stripe, GitHub, Shopify, or your webhook provider settings.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-[11px] text-primary">
                2
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-foreground">Inspect Live Payloads</span>
                <span className="text-muted-foreground leading-relaxed">
                  Head over to the Requests tab to watch incoming webhooks arrive in real time with headers & body formatting.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-[11px] text-primary">
                3
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-foreground">Replay & Mock Responses</span>
                <span className="text-muted-foreground leading-relaxed">
                  Replay requests with custom payloads or set up delay/status rules to simulate edge cases and failures.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
