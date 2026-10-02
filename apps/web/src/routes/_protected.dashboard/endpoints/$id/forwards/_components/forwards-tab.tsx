import { GlobeIcon } from '@phosphor-icons/react'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { useParams, useRouteContext } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { toastManager } from '@/components/ui/toast'
import { formatRelativeTime } from '@/lib/dayjs'

interface ForwardingForm {
  enabled: boolean
  targetUrl: string
}

export function ForwardsTab() {
  const { id: endpointId } = useParams({ from: '/_protected/dashboard/endpoints/$id' })
  const {
    forwardListOptions,
    orpc,
    queryClient,
    ruleOptions,
  } = useRouteContext({
    from: '/_protected/dashboard/endpoints/$id/forwards',
  })

  const ruleQuery = useQuery(ruleOptions)
  const { data: ruleData } = ruleQuery

  const forwardsQuery = useInfiniteQuery(forwardListOptions)
  const forwardLogs = forwardsQuery.data?.pages.flatMap(page => page.items) ?? []

  const [forwarding, setForwarding] = useState<ForwardingForm>({
    enabled: false,
    targetUrl: '',
  })

  const prefilledRef = useRef(false)

  useEffect(() => {
    const rule = ruleData?.rule

    if (rule && !prefilledRef.current) {
      prefilledRef.current = true
      setForwarding({
        enabled: rule.forwardEnabled,
        targetUrl: rule.forwardTargetUrl ?? '',
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
          title: 'Forwarding updated',
          description: forwarding.enabled
            ? 'Incoming requests are now relayed to the destination URL.'
            : 'Forwarding is now disabled for this endpoint.',
        })
      },
    }),
  )

  async function handleSaveForwarding() {
    const targetUrl = forwarding.targetUrl.trim()

    if (forwarding.enabled && (!URL.canParse(targetUrl) || !['http:', 'https:'].includes(new URL(targetUrl).protocol))) {
      toastManager.add({ title: 'A valid http(s) destination URL is required', type: 'error' })
      return
    }

    const rule = ruleData?.rule

    try {
      await saveMutation.mutateAsync({
        body: {
          customResponse: {
            body: rule?.customResponseBody ?? '',
            contentType: rule?.customContentType ?? 'application/json',
            enabled: rule?.customResponseEnabled ?? false,
            statusCode: rule?.customStatusCode ?? 200,
          },
          delay: {
            durationMs: rule?.delayMs ?? 500,
            enabled: rule?.delayEnabled ?? false,
          },
          forwarding: {
            enabled: forwarding.enabled,
            targetUrl,
          },
          signature: {
            enabled: rule?.signatureEnabled ?? false,
            headerName: rule?.signatureHeaderName ?? '',
            secret: rule?.signatureSecret ?? '',
          },
        },
        params: { endpointId },
      })
    }
    catch (error) {
      toastManager.add({
        type: 'error',
        title: 'Could not save forwarding',
        description: error instanceof Error ? error.message : 'Please check the target URL and try again.',
      })
    }
  }

  return (
    <div className="mt-4 flex max-w-4xl flex-col gap-4">
      {/* Forwarding configuration */}
      {ruleQuery.isPending
        ? <Skeleton className="h-20 w-full rounded-xl" />
        : ruleQuery.isError
          ? (
              <Alert variant="error">
                <AlertTitle>Unable to load forwarding settings</AlertTitle>
                <AlertDescription>
                  We could not load the forwarding settings for this endpoint. Saving is disabled
                  until they load.
                </AlertDescription>
                <AlertAction>
                  <Button
                    loading={ruleQuery.isFetching}
                    onClick={() => void ruleQuery.refetch()}
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
              <Card className="shadow-xs">
                <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/10 text-primary">
                      <GlobeIcon className="size-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">Forwarding</CardTitle>
                        <Badge variant={forwarding.enabled ? 'success' : 'outline'}>
                          {forwarding.enabled ? 'Relaying' : 'Disabled'}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        Automatically forward incoming requests to your local development
                        environment or staging webhook handler.
                      </CardDescription>
                    </div>
                  </div>
                  <CardAction>
                    <Switch
                      checked={forwarding.enabled}
                      onCheckedChange={checked => setForwarding(prev => ({ ...prev, enabled: checked }))}
                    />
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 border-t border-border p-4 pt-4 sm:p-6 sm:pt-4">
                  {forwarding.enabled && (
                    <Field className="w-full gap-1.5">
                      <FieldLabel htmlFor="forward-target-url">Destination Target URL</FieldLabel>
                      <Input
                        className="font-mono text-xs"
                        id="forward-target-url"
                        onChange={e => setForwarding(prev => ({ ...prev, targetUrl: e.target.value }))}
                        placeholder="https://staging.yourdomain.com/api/webhooks"
                        type="url"
                        value={forwarding.targetUrl}
                      />
                    </Field>
                  )}
                  <div className="flex justify-end">
                    <Button
                      data-umami-event="Forwarding saved"
                      data-umami-event-button-name="dashboard__forwards-tab__save"
                      disabled={saveMutation.isPending}
                      loading={saveMutation.isPending}
                      onClick={handleSaveForwarding}
                      size="sm"
                      type="button"
                    >
                      Save Forwarding
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

      {/* Forwarding delivery history */}
      <Card className="shadow-xs">
        <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
          <div>
            <CardTitle className="text-lg">Delivery History</CardTitle>
            <CardDescription className="mt-1">
              Attempts made by the forwarding rule, newest first.
            </CardDescription>
          </div>
          <CardAction>
            <Badge variant="outline">
              {forwardLogs.length}
              {' '}
              logs
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          {forwardsQuery.isPending
            ? (
                <div className="flex flex-col gap-2 p-4">
                  {[0, 1, 2].map(index => (
                    <Skeleton key={index} className="h-11 w-full rounded-lg" />
                  ))}
                </div>
              )
            : forwardsQuery.isError
              ? (
                  <div className="p-4">
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
              : forwardLogs.length === 0
                ? (
                    <Empty className="py-12">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <GlobeIcon className="size-5 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle className="text-base">No forwards yet</EmptyTitle>
                        <EmptyDescription>
                          Enable forwarding above and incoming requests will be relayed to your
                          destination.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
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

          {forwardsQuery.hasNextPage && !forwardsQuery.isPending && !forwardsQuery.isError && (
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
