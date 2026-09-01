import { ArrowRightIcon } from '@phosphor-icons/react'
import { useIntlayer } from 'react-intlayer'

export function ComparisonSection() {
  const content = useIntlayer('home')
  const steps = [
    { number: content.stepOneNumber, title: content.stepOneTitle, description: content.stepOneDescription },
    { number: content.stepTwoNumber, title: content.stepTwoTitle, description: content.stepTwoDescription },
    { number: content.stepThreeNumber, title: content.stepThreeTitle, description: content.stepThreeDescription },
  ]

  return (
    <section id="compare" className="scroll-mt-24 border-b border-border">
      <div className="border-b border-border px-6 py-10 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground">{content.compareEyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">{content.compareTitle}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{content.compareDescription}</p>
      </div>
      <div className="grid gap-px bg-border md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={String(step.number)} className="group bg-background px-6 py-10 sm:px-10">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-accent-foreground">{step.number}</span>
              {index < steps.length - 1 && <ArrowRightIcon className="hidden text-muted-foreground md:block" />}
            </div>
            <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em] text-foreground">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
