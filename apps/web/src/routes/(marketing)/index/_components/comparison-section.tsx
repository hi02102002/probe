import { ArrowRightIcon } from '@phosphor-icons/react'

export function ComparisonSection() {
  const steps = [
    { number: '01', title: 'Generate your URL', description: 'Create an isolated endpoint and copy the unique HTTPS URL to your clipboard.' },
    { number: '02', title: 'Trigger an event', description: 'Paste the URL into Stripe, GitHub, or Shopify, or send a manual curl POST.' },
    { number: '03', title: 'Inspect the wire', description: 'Click any captured event to inspect raw bytes, headers, and parsed JSON side-by-side.' },
  ]

  return (
    <section id="compare" className="scroll-mt-24 border-b border-border">
      <div className="border-b border-border px-6 py-10 sm:px-10">
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">Up and running in 30 seconds.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">You shouldn't need a local ngrok agent or a custom auth token just to inspect an incoming POST request from your staging environment.</p>
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
