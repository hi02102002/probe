import {
  ClockIcon,
  CodeIcon,
  GlobeIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toastManager } from '@/components/ui/toast'

export function RulesTab() {
  const [statusRuleEnabled, setStatusRuleEnabled] = useState(true)
  const [statusCode, setStatusCode] = useState('200')
  const [responseBody, setResponseBody] = useState('{\n  "received": true,\n  "status": "success"\n}')

  const [latencyRuleEnabled, setLatencyRuleEnabled] = useState(true)
  const [delayMs, setDelayMs] = useState('500')

  const [signatureRuleEnabled, setSignatureRuleEnabled] = useState(false)
  const [signatureHeader, setSignatureHeader] = useState('Stripe-Signature')
  const [signatureSecret, setSignatureSecret] = useState('whsec_9a8b7c6d5e4f3a2b1c0d9e8f')

  const [forwardingRuleEnabled, setForwardingRuleEnabled] = useState(false)
  const [forwardUrl, setForwardUrl] = useState('http://localhost:3000/api/webhooks')

  function handleSaveRules() {
    toastManager.add({
      title: 'Rules updated successfully',
      description: 'New response rules are now active for incoming webhooks.',
      type: 'success',
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Endpoint Response & Routing Rules</h2>
          <p className="text-sm text-muted-foreground">
            Configure how Probe responds to incoming webhooks and automatically forwards payloads.
          </p>
        </div>
        <Button onClick={handleSaveRules} size="sm">
          Save All Changes
        </Button>
      </div>

      {/* Rule 1: Custom Response Status & Body */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/10 text-primary">
              <CodeIcon className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Custom Response Status & Body</CardTitle>
                <Badge variant={statusRuleEnabled ? 'success' : 'outline'}>
                  {statusRuleEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                Override the HTTP status code and JSON body returned to the webhook sender.
              </CardDescription>
            </div>
          </div>
          <Switch
            checked={statusRuleEnabled}
            onCheckedChange={setStatusRuleEnabled}
          />
        </CardHeader>
        {statusRuleEnabled && (
          <CardContent className="space-y-4 pt-2 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Status Code</label>
                <Input
                  className="font-mono text-xs"
                  onChange={e => setStatusCode(e.target.value)}
                  placeholder="200"
                  value={statusCode}
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-foreground">Content-Type</label>
                <Input
                  className="font-mono text-xs"
                  disabled
                  value="application/json; charset=utf-8"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">JSON Response Body</label>
              <textarea
                className="w-full rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[100px]"
                onChange={e => setResponseBody(e.target.value)}
                rows={4}
                value={responseBody}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Rule 2: Simulated Response Latency / Delay */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ClockIcon className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Simulated Response Latency</CardTitle>
                <Badge variant={latencyRuleEnabled ? 'warning' : 'outline'}>
                  {latencyRuleEnabled ? `${delayMs}ms Delay` : 'Disabled'}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                Delay the response to test how webhook providers handle slow consumers and timeouts.
              </CardDescription>
            </div>
          </div>
          <Switch
            checked={latencyRuleEnabled}
            onCheckedChange={setLatencyRuleEnabled}
          />
        </CardHeader>
        {latencyRuleEnabled && (
          <CardContent className="space-y-4 pt-2 border-t border-border">
            <div className="space-y-1.5 max-w-xs">
              <label className="text-xs font-medium text-foreground">Delay Duration (milliseconds)</label>
              <div className="flex items-center gap-2">
                <Input
                  className="font-mono text-xs"
                  max="10000"
                  min="0"
                  onChange={e => setDelayMs(e.target.value)}
                  type="number"
                  value={delayMs}
                />
                <span className="text-xs text-muted-foreground">ms</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Rule 3: Signature & HMAC Verification */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/10 text-primary">
              <ShieldCheckIcon className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Signature / HMAC Validation</CardTitle>
                <Badge variant={signatureRuleEnabled ? 'success' : 'outline'}>
                  {signatureRuleEnabled ? 'Active' : 'Disabled'}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                Verify webhook signatures from Stripe, GitHub, Shopify or custom HMAC algorithms before capturing.
              </CardDescription>
            </div>
          </div>
          <Switch
            checked={signatureRuleEnabled}
            onCheckedChange={setSignatureRuleEnabled}
          />
        </CardHeader>
        {signatureRuleEnabled && (
          <CardContent className="space-y-4 pt-2 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Signature Header Name</label>
                <Input
                  className="font-mono text-xs"
                  onChange={e => setSignatureHeader(e.target.value)}
                  placeholder="Stripe-Signature"
                  value={signatureHeader}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Webhook Secret Key</label>
                <Input
                  className="font-mono text-xs"
                  onChange={e => setSignatureSecret(e.target.value)}
                  placeholder="whsec_..."
                  type="password"
                  value={signatureSecret}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Rule 4: Webhook Forwarding / Relay */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/10 text-primary">
              <GlobeIcon className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Webhook Forwarding / Relay</CardTitle>
                <Badge variant={forwardingRuleEnabled ? 'success' : 'outline'}>
                  {forwardingRuleEnabled ? 'Relaying' : 'Disabled'}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                Automatically forward incoming requests to your local development environment or staging webhook handler.
              </CardDescription>
            </div>
          </div>
          <Switch
            checked={forwardingRuleEnabled}
            onCheckedChange={setForwardingRuleEnabled}
          />
        </CardHeader>
        {forwardingRuleEnabled && (
          <CardContent className="space-y-4 pt-2 border-t border-border">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Destination Target URL</label>
              <Input
                className="font-mono text-xs"
                onChange={e => setForwardUrl(e.target.value)}
                placeholder="http://localhost:3000/api/webhooks"
                value={forwardUrl}
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
