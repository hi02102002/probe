import {
  ClockIcon,
  CodeIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams, useRouteContext } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toastManager } from '@/components/ui/toast'

interface CustomResponseForm {
  body: string
  contentType: string
  enabled: boolean
  statusCode: string
}

interface DelayForm {
  durationMs: string
  enabled: boolean
}

interface SignatureForm {
  enabled: boolean
  headerName: string
  secret: string
}

const DEFAULT_CUSTOM_RESPONSE: CustomResponseForm = {
  body: '{\n  "received": true,\n  "status": "success"\n}',
  contentType: 'application/json',
  enabled: false,
  statusCode: '200',
}

const DEFAULT_DELAY: DelayForm = {
  durationMs: '500',
  enabled: false,
}

const DEFAULT_SIGNATURE: SignatureForm = {
  enabled: false,
  headerName: 'X-Webhook-Signature',
  secret: '',
}

export function RulesTab() {
  const { id: endpointId } = useParams({ from: '/_protected/dashboard/endpoints/$id' })
  const { orpc, queryClient, ruleOptions } = useRouteContext({
    from: '/_protected/dashboard/endpoints/$id/rules',
  })

  const {
    data: ruleData,
    isError: isRuleError,
    isFetching: isRuleFetching,
    isPending: isRulePending,
    refetch: refetchRule,
  } = useQuery(ruleOptions)

  const [customResponse, setCustomResponse] = useState<CustomResponseForm>(DEFAULT_CUSTOM_RESPONSE)
  const [delay, setDelay] = useState<DelayForm>(DEFAULT_DELAY)
  const [signature, setSignature] = useState<SignatureForm>(DEFAULT_SIGNATURE)

  const prefilledRef = useRef(false)

  useEffect(() => {
    const rule = ruleData?.rule

    if (rule && !prefilledRef.current) {
      prefilledRef.current = true
      setCustomResponse({
        body: rule.customResponseBody ?? DEFAULT_CUSTOM_RESPONSE.body,
        contentType: rule.customContentType ?? DEFAULT_CUSTOM_RESPONSE.contentType,
        enabled: rule.customResponseEnabled,
        statusCode: String(rule.customStatusCode ?? 200),
      })
      setDelay({
        durationMs: String(rule.delayMs ?? 500),
        enabled: rule.delayEnabled,
      })
      setSignature({
        enabled: rule.signatureEnabled,
        headerName: rule.signatureHeaderName ?? DEFAULT_SIGNATURE.headerName,
        secret: rule.signatureSecret ?? '',
      })
    }
  }, [ruleData])

  const saveMutation = useMutation(
    orpc.rule.save.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.rule.get.key(),
        })

        toastManager.add({
          type: 'success',
          title: 'Rules updated successfully',
          description: 'New response rules are now active for incoming webhooks.',
        })
      },
    }),
  )

  async function handleSaveRules() {
    const statusCode = Number.parseInt(customResponse.statusCode, 10)
    const durationMs = Number.parseInt(delay.durationMs, 10)

    if (!Number.isFinite(statusCode) || statusCode < 100 || statusCode > 599) {
      toastManager.add({ title: 'Status code must be between 100 and 599', type: 'error' })
      return
    }

    if (!Number.isFinite(durationMs) || durationMs < 0 || durationMs > 10_000) {
      toastManager.add({ title: 'Delay must be between 0 and 10000ms', type: 'error' })
      return
    }

    if (signature.enabled) {
      if (signature.headerName.trim().length === 0) {
        toastManager.add({ title: 'Signature header name is required', type: 'error' })
        return
      }

      if (signature.secret.trim().length < 8) {
        toastManager.add({ title: 'Signature secret must be at least 8 characters', type: 'error' })
        return
      }
    }

    try {
      await saveMutation.mutateAsync({
        body: {
          customResponse: {
            body: customResponse.body,
            contentType: customResponse.contentType.trim() || 'application/json',
            enabled: customResponse.enabled,
            statusCode,
          },
          delay: {
            durationMs,
            enabled: delay.enabled,
          },
          forwarding: {
            enabled: ruleData?.rule?.forwardEnabled ?? false,
            targetUrl: ruleData?.rule?.forwardTargetUrl ?? '',
          },
          signature: {
            enabled: signature.enabled,
            headerName: signature.headerName.trim(),
            secret: signature.secret.trim(),
          },
        },
        params: { endpointId },
      })
    }
    catch (error) {
      toastManager.add({
        type: 'error',
        title: 'Could not save rules',
        description: error instanceof Error ? error.message : 'Please check your rule values and try again.',
      })
    }
  }

  if (isRulePending) {
    return (
      <div className="mt-4 flex max-w-4xl flex-col gap-4">
        {[0, 1, 2].map(index => (
          <Skeleton key={index} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (isRuleError) {
    return (
      <div className="mt-4 flex max-w-4xl flex-col gap-4">
        <Alert variant="error">
          <AlertTitle>Unable to load rules</AlertTitle>
          <AlertDescription>
            We could not load the rules for this endpoint. Saving is disabled until they load,
            so your current settings are never overwritten.
          </AlertDescription>
          <AlertAction>
            <Button
              loading={isRuleFetching}
              onClick={() => void refetchRule()}
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-foreground text-lg">Endpoint Response &amp; Routing Rules</h2>
          <p className="text-muted-foreground text-sm">
            Configure how Probe responds to incoming webhooks and automatically forwards payloads.
          </p>
        </div>
        <Button
          data-umami-event="Rules saved"
          data-umami-event-button-name="dashboard__rules-tab__save"
          disabled={isRuleError || saveMutation.isPending}
          loading={saveMutation.isPending}
          onClick={handleSaveRules}
          size="sm"
          type="button"
        >
          Save All Changes
        </Button>
      </div>

      {/* Rule 1: Custom Response Status & Body */}
      <Card className="shadow-xs">
        <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/10 text-primary">
              <CodeIcon className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Custom Response Status &amp; Body</CardTitle>
                <Badge variant={customResponse.enabled ? 'success' : 'outline'}>
                  {customResponse.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                Override the HTTP status code and JSON body returned to the webhook sender.
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <Switch
              checked={customResponse.enabled}
              onCheckedChange={checked => setCustomResponse(prev => ({ ...prev, enabled: checked }))}
            />
          </CardAction>
        </CardHeader>
        {customResponse.enabled && (
          <CardContent className="flex flex-col gap-4 border-t border-border p-4 pt-4 sm:p-6 sm:pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field className="w-full gap-1.5">
                <FieldLabel htmlFor="rule-status-code">Status Code</FieldLabel>
                <Input
                  className="font-mono text-xs"
                  id="rule-status-code"
                  onChange={e => setCustomResponse(prev => ({ ...prev, statusCode: e.target.value }))}
                  placeholder="200"
                  value={customResponse.statusCode}
                />
              </Field>
              <Field className="w-full gap-1.5 sm:col-span-2">
                <FieldLabel htmlFor="rule-content-type">Content-Type</FieldLabel>
                <Input
                  className="font-mono text-xs"
                  id="rule-content-type"
                  onChange={e => setCustomResponse(prev => ({ ...prev, contentType: e.target.value }))}
                  value={customResponse.contentType}
                />
              </Field>
            </div>

            <Field className="w-full gap-1.5">
              <FieldLabel htmlFor="rule-response-body">JSON Response Body</FieldLabel>
              <Textarea
                className="min-h-[100px] font-mono text-xs leading-relaxed"
                id="rule-response-body"
                onChange={e => setCustomResponse(prev => ({ ...prev, body: e.target.value }))}
                rows={4}
                value={customResponse.body}
              />
            </Field>
          </CardContent>
        )}
      </Card>

      {/* Rule 2: Simulated Response Latency / Delay */}
      <Card className="shadow-xs">
        <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ClockIcon className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Simulated Response Latency</CardTitle>
                <Badge variant={delay.enabled ? 'warning' : 'outline'}>
                  {delay.enabled ? `${delay.durationMs}ms Delay` : 'Disabled'}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                Delay the response to test how webhook providers handle slow consumers and timeouts.
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <Switch
              checked={delay.enabled}
              onCheckedChange={checked => setDelay(prev => ({ ...prev, enabled: checked }))}
            />
          </CardAction>
        </CardHeader>
        {delay.enabled && (
          <CardContent className="flex flex-col gap-4 border-t border-border p-4 pt-4 sm:p-6 sm:pt-4">
            <Field className="w-full max-w-xs gap-1.5">
              <FieldLabel htmlFor="rule-delay-ms">Delay Duration (milliseconds)</FieldLabel>
              <div className="flex items-center gap-2">
                <Input
                  className="font-mono text-xs"
                  id="rule-delay-ms"
                  max="10000"
                  min="0"
                  onChange={e => setDelay(prev => ({ ...prev, durationMs: e.target.value }))}
                  type="number"
                  value={delay.durationMs}
                />
                <span className="text-muted-foreground text-xs">ms</span>
              </div>
            </Field>
          </CardContent>
        )}
      </Card>

      {/* Rule 3: Signature / HMAC Validation */}
      <Card className="shadow-xs">
        <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/10 text-primary">
              <ShieldCheckIcon className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Signature / HMAC Validation</CardTitle>
                <Badge variant={signature.enabled ? 'success' : 'outline'}>
                  {signature.enabled ? 'Active' : 'Disabled'}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                Requests without a valid HMAC-SHA256 signature (raw body, hex or
                {' '}
                sha256=
                prefixed) are rejected with 401 before being captured.
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <Switch
              checked={signature.enabled}
              onCheckedChange={checked => setSignature(prev => ({ ...prev, enabled: checked }))}
            />
          </CardAction>
        </CardHeader>
        {signature.enabled && (
          <CardContent className="flex flex-col gap-4 border-t border-border p-4 pt-4 sm:p-6 sm:pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field className="w-full gap-1.5">
                <FieldLabel htmlFor="rule-signature-header">Signature Header Name</FieldLabel>
                <Input
                  className="font-mono text-xs"
                  id="rule-signature-header"
                  onChange={e => setSignature(prev => ({ ...prev, headerName: e.target.value }))}
                  placeholder="Stripe-Signature"
                  value={signature.headerName}
                />
              </Field>
              <Field className="w-full gap-1.5">
                <FieldLabel htmlFor="rule-signature-secret">Webhook Secret Key</FieldLabel>
                <Input
                  className="font-mono text-xs"
                  id="rule-signature-secret"
                  onChange={e => setSignature(prev => ({ ...prev, secret: e.target.value }))}
                  placeholder="whsec_..."
                  type="password"
                  value={signature.secret}
                />
              </Field>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
