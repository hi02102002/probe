import { ArrowRightIcon } from '@phosphor-icons/react'
import { useIntlayer } from 'react-intlayer'
import { LocalizedLink } from '@/components/localized-link'
import { Button } from '@/components/ui/button'

export function PricingSection() {
  const content = useIntlayer('home')

  return (
    <section id="pricing" className="scroll-mt-24 border-b border-border px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground">{content.pricingEyebrow}</p>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">{content.pricingTitle}</h2>
        <p className="mt-5 max-w-2xl text-pretty leading-7 text-muted-foreground">{content.pricingDescription}</p>
        <Button className="mt-8" render={<LocalizedLink to="/dashboard" />} size="xl">
          {content.startFree}
          <ArrowRightIcon weight="bold" />
        </Button>
      </div>
    </section>
  )
}
