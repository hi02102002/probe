import { CheckIcon, PlugsIcon } from '@phosphor-icons/react'
import { getPlanLimits } from '@repo/utils'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { AppShell, PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/layouts/dashboard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toastManager } from '@/components/ui/toast'
import { getAuthSessionQueryOptions } from '@/features/auth/api/auth-session'
import { getAuthClient } from '@/features/auth/lib/auth-client'

function extractResultUrl(result: unknown): string | null {
  if (result && typeof result === 'object' && 'data' in result) {
    const data = (result as { data?: { url?: unknown } }).data

    if (data && typeof data.url === 'string') {
      return data.url
    }
  }

  return null
}

function extractErrorMessage(result: unknown, fallback: string): string {
  if (result && typeof result === 'object' && 'error' in result) {
    const error = (result as { error?: { message?: unknown } }).error

    if (error && typeof error.message === 'string' && error.message.length > 0) {
      return error.message
    }
  }

  return fallback
}

export function BillingPage({
  billingConfigured,
  checkoutCompleted,
}: {
  billingConfigured: boolean
  checkoutCompleted?: boolean
}) {
  const navigate = useNavigate()
  const { data: session } = useQuery(getAuthSessionQueryOptions)
  const plan = session?.user.plan === 'premium' ? 'premium' : 'free'
  const limits = getPlanLimits(plan)
  const isPremium = plan === 'premium'

  const toastShownRef = useRef(false)

  useEffect(() => {
    if (checkoutCompleted && !toastShownRef.current) {
      toastShownRef.current = true
      toastManager.add({
        type: 'success',
        title: 'Payment received',
        description: 'Welcome to Premium! Your plan may take a moment to activate.',
      })
      void navigate({ search: {}, to: '/dashboard/billing', replace: true })
    }
  }, [checkoutCompleted, navigate])

  async function handleUpgrade() {
    const result = await getAuthClient().checkout({ slug: 'pro' })
    const url = extractResultUrl(result)

    if (url) {
      window.location.href = url
      return
    }

    toastManager.add({
      type: 'error',
      title: 'Could not start checkout',
      description: extractErrorMessage(result, 'Billing is not available right now. Please try again later.'),
    })
  }

  async function handleManageSubscription() {
    const result = await getAuthClient().customer.portal()
    const url = extractResultUrl(result)

    if (url) {
      window.location.href = url
      return
    }

    toastManager.add({
      type: 'error',
      title: 'Could not open the customer portal',
      description: extractErrorMessage(result, 'Billing is not available right now. Please try again later.'),
    })
  }

  return (
    <AppShell>
      <PageHeader>
        <PageHeaderTitle>
          Billing
        </PageHeaderTitle>
        <PageHeaderDescription>
          Manage your plan, limits and billing details.
        </PageHeaderDescription>
      </PageHeader>

      <div className="flex flex-col gap-4">
        {!billingConfigured && (
          <Alert variant="info">
            <PlugsIcon />
            <AlertTitle>Upgrades are temporarily unavailable</AlertTitle>
            <AlertDescription>
              Online payments are being set up right now. Your current plan
              keeps working — please check back soon.
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-xs">
          <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Current plan</CardTitle>
                <Badge variant={isPremium ? 'success' : 'outline'}>
                  {isPremium ? 'Premium' : 'Free'}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                {isPremium
                  ? 'You are on the Premium plan. Thank you for supporting Probe!'
                  : 'Upgrade to Premium for more endpoints and longer retention.'}
              </CardDescription>
            </div>
            <CardAction>
              {billingConfigured && (isPremium
                ? (
                    <Button onClick={handleManageSubscription} size="sm" variant="outline">
                      Manage subscription
                    </Button>
                  )
                : (
                    <Button
                      data-umami-event="Billing upgrade clicked"
                      data-umami-event-button-name="dashboard__billing__upgrade"
                      onClick={handleUpgrade}
                      size="sm"
                    >
                      Upgrade to Premium
                    </Button>
                  ))}
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 border-t border-border p-4 pt-4 text-sm sm:p-6 sm:pt-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Endpoints</span>
              <span className="font-medium">
                up to
                {' '}
                {limits.maxEndpoints}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Request retention</span>
              <span className="font-medium">
                {limits.retentionDays}
                {' '}
                {limits.retentionDays === 1 ? 'day' : 'days'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
            <div>
              <CardTitle className="text-base">Compare plans</CardTitle>
              <CardDescription className="mt-1">
                Pick the plan that matches how much webhook traffic you debug.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 border-t border-border p-4 pt-4 sm:grid-cols-2 sm:p-6 sm:pt-4">
            {(['free', 'premium'] as const).map((planKey) => {
              const planLimits = getPlanLimits(planKey)

              return (
                <div className="flex flex-col gap-2 rounded-xl border border-border p-4" key={planKey}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {planKey === 'free' ? 'Free' : 'Premium'}
                    </span>
                    <Badge variant={planKey === 'premium' ? 'success' : 'outline'}>
                      {planKey === 'free' ? '$0' : '$7/mo'}
                    </Badge>
                  </div>
                  <ul className="flex flex-col gap-1.5 text-muted-foreground text-sm">
                    <li className="flex items-center gap-1.5">
                      <CheckIcon className="size-3.5 text-emerald-500" weight="bold" />
                      Up to
                      {' '}
                      {planLimits.maxEndpoints}
                      {' '}
                      endpoints
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckIcon className="size-3.5 text-emerald-500" weight="bold" />
                      Requests kept for
                      {' '}
                      {planLimits.retentionDays}
                      {' '}
                      {planLimits.retentionDays === 1 ? 'day' : 'days'}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckIcon className="size-3.5 text-emerald-500" weight="bold" />
                      Rules, replay and forwarding
                    </li>
                  </ul>
                  {billingConfigured && planKey === 'premium' && !isPremium && (
                    <Button onClick={handleUpgrade} size="sm" variant="outline">
                      Upgrade
                    </Button>
                  )}
                  {billingConfigured && planKey === 'premium' && isPremium && (
                    <Button disabled size="sm" variant="outline">
                      Current plan
                    </Button>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-xs">
          Payments are processed by Polar. Manage invoices and payment methods
          from the customer portal.
        </p>
      </div>
    </AppShell>
  )
}
