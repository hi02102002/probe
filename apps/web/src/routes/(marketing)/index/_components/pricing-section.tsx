import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react'
import { PLAN_LIMITS } from '@repo/utils'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const PLANS = [
  {
    cta: 'Start debugging',
    description: 'Everything you need to inspect your first webhooks.',
    features: [
      `${PLAN_LIMITS.free.maxEndpoints} endpoints`,
      'Requests kept for 24 hours',
      'Rules, replay and forwarding',
      'Live request streaming',
    ],
    key: 'free' as const,
    name: 'Free',
    price: '$0',
    to: '/dashboard' as const,
  },
  {
    cta: 'Upgrade to Premium',
    description: 'For teams debugging serious webhook traffic every day.',
    features: [
      `${PLAN_LIMITS.premium.maxEndpoints} endpoints`,
      `Requests kept for ${PLAN_LIMITS.premium.retentionDays} days`,
      'Rules, replay and forwarding',
      'Live request streaming',
      'Priority support',
    ],
    key: 'premium' as const,
    name: 'Premium',
    price: '$7',
    to: '/dashboard/billing' as const,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 border-b border-border px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">Catch the next webhook right now.</h2>
        <p className="mt-5 max-w-2xl text-pretty leading-7 text-muted-foreground">
          No sign-up wall. No binary to compile. Hit the button below, grab a fresh endpoint, paste it into your Stripe or GitHub developer console, and watch raw payloads stream into your browser in under 15 milliseconds.
        </p>
      </div>
      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {PLANS.map(plan => (
          <div
            className={`flex flex-col gap-4 rounded-2xl border bg-card p-6 text-left shadow-xs/5 ${plan.key === 'premium' ? 'border-primary/40' : 'border-border'}`}
            key={plan.key}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{plan.name}</span>
              <Badge variant={plan.key === 'premium' ? 'success' : 'outline'}>
                {plan.price}
                {plan.key === 'premium' ? '/mo' : ''}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">{plan.description}</p>
            <ul className="flex flex-col gap-1.5 text-muted-foreground text-sm">
              {plan.features.map(feature => (
                <li className="flex items-center gap-1.5" key={feature}>
                  <CheckIcon className="size-3.5 shrink-0 text-emerald-500" weight="bold" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="mt-auto w-full"
              data-umami-event-button-name={`home__pricing__${plan.key}`}
              data-umami-link-event="Pricing plan clicked"
              render={<Link to={plan.to} />}
              variant={plan.key === 'premium' ? 'default' : 'outline'}
            >
              {plan.cta}
              <ArrowRightIcon weight="bold" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
