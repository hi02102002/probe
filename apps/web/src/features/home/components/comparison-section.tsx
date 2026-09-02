import { ArrowRightIcon } from '@phosphor-icons/react'

export function ComparisonSection() {
  const steps = [
    { number: '01', title: 'Create an endpoint', description: 'Give the endpoint a clear name and copy its unique URL.' },
    { number: '02', title: 'Send a webhook', description: 'Paste the URL into your provider, or send a test request yourself.' },
    { number: '03', title: 'Inspect what arrived', description: 'Open the captured request and verify every field against your integration.' },
  ]

  return (
    <section id="compare" className="scroll-mt-24 border-b border-border">
      <div className="border-b border-border px-6 py-10 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground">A simple debugging loop</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">From endpoint to answer in three steps.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">No SDK or local tunnel is required to see what a webhook provider sends.</p>
      </div>
      <div className="grid gap-px bg-border md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.number} className="group bg-background px-6 py-10 sm:px-10">
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
