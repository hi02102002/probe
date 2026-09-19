import {
  CloudArrowUpIcon,
  GaugeIcon,
  LockKeyIcon,
  MagnifyingGlassIcon,
  PulseIcon,
} from '@phosphor-icons/react'

export function FeaturesSection() {
  const benefits = [
    { icon: GaugeIcon, title: 'Dedicated URLs', description: 'Create separate endpoints for dev, staging, or individual feature branches.', wide: true },
    { icon: MagnifyingGlassIcon, title: 'Header inspection', description: 'Inspect Stripe-Signature, X-Hub-Signature-256, and auth tokens directly.' },
    { icon: LockKeyIcon, title: 'Query & path parsing', description: 'Check custom webhook path parameters and query strings as they landed.' },
    { icon: PulseIcon, title: 'Timeline replay', description: 'Order events chronologically to catch race conditions across concurrent webhooks.' },
    { icon: CloudArrowUpIcon, title: 'Wire metadata', description: 'Measure payload sizes down to the exact byte and view origin IP addresses.' },
  ]

  return (
    <section id="features" className="scroll-mt-24 border-b border-border">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center border-b border-border px-6 py-14 sm:px-10 lg:border-b-0 lg:border-r lg:py-20">
          <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">Raw wire data never lies.</h2>
          <p className="mt-6 max-w-lg leading-7 text-muted-foreground">
            Most webhook integration bugs come down to an unexpected character in an HMAC header or a framework silently stripping custom query parameters. When a third-party webhook hits your Probe URL, we capture the exact incoming TCP payload before any parser touches it. You get every header key-value pair, the full unmutated request body, and the sender origin IP right on your dashboard screen.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border">
          {benefits.map(({ icon: Icon, title, description, wide }) => (
            <article key={title} className={`group relative overflow-hidden bg-background p-6 sm:p-8 ${wide ? 'col-span-2' : ''}`}>
              {wide && <div className="probe-grid-accent absolute inset-y-0 right-0 w-1/2" />}
              <Icon className="relative size-5 text-accent-foreground transition-transform group-hover:-translate-y-0.5" />
              <h3 className="relative mt-5 whitespace-nowrap text-base font-semibold text-foreground sm:text-lg">{title}</h3>
              <p className="relative mt-2 line-clamp-2 min-h-12 max-w-64 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
