import {
  CloudArrowUpIcon,
  GaugeIcon,
  LockKeyIcon,
  MagnifyingGlassIcon,
  PulseIcon,
} from '@phosphor-icons/react'

export function FeaturesSection() {
  const benefits = [
    { icon: GaugeIcon, title: 'Unique endpoint', description: 'Name one endpoint for each integration or test.', wide: true },
    { icon: MagnifyingGlassIcon, title: 'Headers & payload', description: 'View every header and the full JSON payload.' },
    { icon: LockKeyIcon, title: 'URL & query', description: 'Check the exact path and query values sent.' },
    { icon: PulseIcon, title: 'Request history', description: 'Review requests by method and received time.' },
    { icon: CloudArrowUpIcon, title: 'Request metadata', description: 'See status, source IP, and request size.' },
  ]

  return (
    <section id="features" className="scroll-mt-24 border-b border-border">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center border-b border-border px-6 py-14 sm:px-10 lg:border-b-0 lg:border-r lg:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground">Everything that arrived</p>
          <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">The request is the evidence.</h2>
          <p className="mt-6 max-w-lg leading-7 text-muted-foreground">Probe keeps the parts of an incoming webhook together, so you can stop reconstructing failures from scattered logs and start with what the provider actually sent.</p>
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
