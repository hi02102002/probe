import type { UserPlan } from '@repo/utils'
import {
  BroadcastIcon,
  CheckIcon,
  ClockClockwiseIcon,
  CrownIcon,
  HeadsetIcon,
  PlugsIcon,
  StackIcon,
  UserCircleIcon,
  WrenchIcon,
} from '@phosphor-icons/react'
import { getPlanLimits, PLAN_LIMITS } from '@repo/utils'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useRouteContext } from '@tanstack/react-router'
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
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress'
import { toastManager } from '@/components/ui/toast'
import { getAuthSessionQueryOptions } from '@/features/auth/api/auth-session'
import { getAuthClient } from '@/features/auth/lib/auth-client'
import { cn } from '@/lib/cn'

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

interface PlanFeature {
  icon: React.ComponentType<React.ComponentProps<typeof StackIcon>>
  text: string
}

function getPlanFeatures(plan: UserPlan): PlanFeature[] {
  const limits = PLAN_LIMITS[plan]

  const features: PlanFeature[] = [
    {
      icon: StackIcon,
      text: `Up to ${limits.maxEndpoints} endpoints`,
    },
    {
      icon: ClockClockwiseIcon,
      text: `Requests kept for ${limits.retentionDays} ${limits.retentionDays === 1 ? 'day' : 'days'}`,
    },
    {
      icon: WrenchIcon,
      text: 'Rules, replay and forwarding',
    },
    {
      icon: BroadcastIcon,
      text: 'Live request streaming',
    },
  ]

  if (plan === 'premium') {
    features.push({
      icon: HeadsetIcon,
      text: 'Priority support',
    })
  }

  return features
}

export function BillingPage({
  billingConfigured,
  checkoutCompleted,
}: {
  billingConfigured: boolean
  checkoutCompleted?: boolean
}) {
  const navigate = useNavigate()
  const { statsOptions } = useRouteContext({ from: '/_protected/dashboard/billing' })
  const { data: session } = useQuery(getAuthSessionQueryOptions)
  const statsQuery = useQuery(statsOptions)
  const plan = session?.user.plan === 'premium' ? 'premium' : 'free'
  const limits = getPlanLimits(plan)
  const isPremium = plan === 'premium'
  const endpointsUsed = statsQuery.data?.stats.endpoints ?? 0
  const usagePercent = Math.min(100, Math.round((endpointsUsed / limits.maxEndpoints) * 100))

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

      <div className="mt-6 flex flex-col gap-4">
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
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-lg border',
                  isPremium ? 'border-success/20 bg-success/10 text-success' : 'border-chart-1/20 bg-chart-1/10 text-chart-1',
                )}
              >
                {isPremium
                  ? <CrownIcon className="size-5" weight="duotone" />
                  : <UserCircleIcon className="size-5" weight="duotone" />}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">
                    {isPremium ? 'Premium' : 'Free'}
                  </CardTitle>
                  <Badge variant="outline">
                    Current plan
                  </Badge>
                </div>
                <CardDescription className="mt-0.5">
                  {isPremium
                    ? 'Thank you for supporting Probe!'
                    : 'Upgrade to Premium for more endpoints and longer retention.'}
                </CardDescription>
              </div>
            </div>
            <CardAction>
              <div className="flex flex-col items-end gap-2">
                <span className="font-semibold text-foreground text-xl">
                  {isPremium ? '$7' : '$0'}
                  <span className="font-normal text-muted-foreground text-sm">/mo</span>
                </span>
                {billingConfigured && (isPremium
                  ? (
                      <Button onClick={handleManageSubscription} variant="outline">
                        Manage subscription
                      </Button>
                    )
                  : (
                      <Button
                        data-umami-event="Billing upgrade clicked"
                        data-umami-event-button-name="dashboard__billing__upgrade"
                        onClick={handleUpgrade}
                      >
                        Upgrade to Premium
                      </Button>
                    ))}
              </div>
            </CardAction>
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
          <CardContent className="grid grid-cols-1 gap-4 border-t border-border p-4 pt-4 sm:p-6 sm:pt-4 lg:grid-cols-2">
            <PricingColumn
              currentPlan={plan}
              onUpgrade={handleUpgrade}
              planKey="free"
              showUpgradeActions={billingConfigured}
            />
            <PricingColumn
              currentPlan={plan}
              onUpgrade={handleUpgrade}
              planKey="premium"
              showUpgradeActions={billingConfigured}
            />
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

function PricingColumn({
  currentPlan,
  onUpgrade,
  planKey,
  showUpgradeActions,
}: {
  currentPlan: UserPlan
  onUpgrade: () => Promise<void> | void
  planKey: UserPlan
  showUpgradeActions: boolean
}) {
  const isPremium = planKey === 'premium'
  const isCurrent = currentPlan === planKey
  const features = getPlanFeatures(planKey)

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border p-4 sm:p-5',
        isPremium && !isCurrent && 'border-primary/40',
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">
            {isPremium ? 'Premium' : 'Free'}
          </span>
          {isCurrent
            ? <Badge variant="success">Current</Badge>
            : isPremium && <Badge variant="info">Recommended</Badge>}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-semibold text-3xl text-foreground">
            {isPremium ? '$7' : '$0'}
          </span>
          <span className="text-muted-foreground text-sm">/mo</span>
        </div>
        <p className="mt-1 text-muted-foreground text-sm">
          {isPremium
            ? 'For teams debugging serious webhook traffic every day.'
            : 'For trying out webhook debugging.'}
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {features.map((feature) => {
          return (
            <li className="flex items-center gap-2 text-sm" key={feature.text}>
              <feature.icon className="size-4 shrink-0 text-muted-foreground" weight="duotone" />
              <span className="text-foreground">
                {feature.text}
              </span>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto">
        {isCurrent
          ? (
              <Button className="w-full" disabled variant="outline">
                Current plan
              </Button>
            )
          : showUpgradeActions && isPremium
            ? (
                <Button
                  className="w-full"
                  data-umami-event="Billing plan upgrade clicked"
                  data-umami-event-button-name="dashboard__billing__plan-upgrade"
                  onClick={() => void onUpgrade()}
                >
                  <CheckIcon className="size-4" weight="bold" />
                  Upgrade to Premium
                </Button>
              )
            : null}
      </div>
    </div>
  )
}
