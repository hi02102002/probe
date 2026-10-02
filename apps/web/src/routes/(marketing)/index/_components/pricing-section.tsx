import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react'
import { PLAN_LIMITS } from '@repo/utils'
import { Link } from '@tanstack/react-router'

const PLANS = [
  {
    cta: 'Start debugging',
    features: [
      `${PLAN_LIMITS.free.maxEndpoints} endpoints`,
      'Requests kept for 24 hours',
      'Rules, replay and forwarding',
      'Live request streaming',
    ],
    key: 'free' as const,
    label: 'Free tier',
    price: '$0',
    tagline: 'Everything you need to catch your first webhooks.',
    to: '/dashboard' as const,
  },
  {
    cta: 'Upgrade',
    features: [
      `${PLAN_LIMITS.premium.maxEndpoints} endpoints`,
      `Requests kept for ${PLAN_LIMITS.premium.retentionDays} days`,
      'Rules, replay and forwarding',
      'Live request streaming',
      'Priority support',
    ],
    key: 'premium' as const,
    label: 'Premium',
    price: '$7',
    tagline: 'For teams debugging serious webhook traffic every day.',
    to: '/dashboard/billing' as const,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-xs/5">
        <div className="border-b border-border px-8 py-10 sm:px-10">
          <h2 className="text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">Priced fairly.</h2>
          <p className="mt-3 text-muted-foreground">Simple, flat-rate plans. No surprise fees.</p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-border border-b border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {PLANS.map(plan => (
            <div className="flex flex-col px-8 py-8 sm:px-10" key={plan.key}>
              <span className="font-medium text-muted-foreground text-xs tracking-[0.2em] uppercase">{plan.label}</span>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-semibold text-5xl text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-muted-foreground text-sm">{plan.tagline}</span>
                <Link
                  className="flex shrink-0 items-center gap-1.5 font-medium text-primary hover:underline"
                  data-umami-event-button-name={`home__pricing__${plan.key}`}
                  data-umami-link-event="Pricing plan clicked"
                  to={plan.to}
                >
                  {plan.cta}
                  <ArrowRightIcon className="size-4" weight="bold" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {PLANS.map(plan => (
            <ul className="divide-y divide-border" key={plan.key}>
              {plan.features.map(feature => (
                <li className="flex items-center gap-2.5 px-8 py-3.5 text-muted-foreground text-sm sm:px-10" key={feature}>
                  <CheckIcon className="size-3.5 shrink-0" weight="bold" />
                  {feature}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
