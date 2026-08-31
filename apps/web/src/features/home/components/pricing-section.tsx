import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react'
import { useIntlayer } from 'react-intlayer'
import { LocalizedLink } from '@/components/localized-link'

export function PricingSection() {
  const content = useIntlayer('home')
  const plans = [
    { name: content.developerPlan, price: '$0', note: content.developerNote, features: [content.devFeature1, content.devFeature2, content.devFeature3, content.devFeature4] },
    { name: content.teamPlan, price: '$12', note: content.teamNote, features: [content.teamFeature1, content.teamFeature2, content.teamFeature3, content.teamFeature4] },
  ]

  return (
    <section id="pricing" className="scroll-mt-24 border-b border-border">
      <div className="border-b border-border px-6 py-10 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground">{content.pricingEyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">{content.pricingTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{content.pricingDescription}</p>
      </div>
      <div className="grid gap-px bg-border md:grid-cols-2">
        {plans.map((plan, index) => (
          <article key={String(plan.name)} className="bg-background">
            <div className="flex items-end justify-between gap-4 border-b border-border px-6 py-9 sm:px-10">
              <div>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{plan.name}</p>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-5xl font-semibold tracking-[-0.05em] text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{content.perMonth}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.note}</p>
              </div>
              <LocalizedLink className="inline-flex items-center gap-1 text-sm font-semibold text-accent-foreground transition-colors hover:text-primary" to={index === 0 ? '/dashboard' : '/login'}>
                {index === 0 ? content.startFree : content.chooseTeam}
                <ArrowRightIcon weight="bold" />
              </LocalizedLink>
            </div>
            <ul className="grid gap-px bg-border sm:grid-cols-2">
              {plan.features.map(feature => (
                <li key={String(feature)} className="flex items-center gap-3 bg-background px-6 py-4 text-sm text-muted-foreground sm:px-10">
                  <CheckIcon className="shrink-0 text-accent-foreground" weight="bold" />
                  {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
