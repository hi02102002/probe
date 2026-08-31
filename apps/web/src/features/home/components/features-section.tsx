import {
  CloudArrowUpIcon,
  GaugeIcon,
  LockKeyIcon,
  MagnifyingGlassIcon,
  PulseIcon,
} from '@phosphor-icons/react'
import { useIntlayer } from 'react-intlayer'

export function FeaturesSection() {
  const content = useIntlayer('home')
  const benefits = [
    { icon: GaugeIcon, title: content.fastTitle, description: content.fastDescription, wide: true },
    { icon: MagnifyingGlassIcon, title: content.inspectTitle, description: content.inspectDescription },
    { icon: LockKeyIcon, title: content.privateTitle, description: content.privateDescription },
    { icon: PulseIcon, title: content.liveTitle, description: content.liveDescription },
    { icon: CloudArrowUpIcon, title: content.deployTitle, description: content.deployDescription },
  ]

  return (
    <section id="features" className="scroll-mt-24 border-b border-border">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center border-b border-border px-6 py-14 sm:px-10 lg:border-b-0 lg:border-r lg:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground">{content.featureEyebrow}</p>
          <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">{content.featureTitle}</h2>
          <p className="mt-6 max-w-lg leading-7 text-muted-foreground">{content.featureDescription}</p>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border">
          {benefits.map(({ icon: Icon, title, description, wide }) => (
            <article key={String(title)} className={`group relative overflow-hidden bg-background p-6 sm:p-8 ${wide ? 'col-span-2' : ''}`}>
              {wide && <div className="probe-grid-accent absolute inset-y-0 right-0 w-1/2" />}
              <Icon className="relative size-5 text-accent-foreground transition-transform group-hover:-translate-y-0.5" />
              <h3 className="relative mt-5 text-base font-semibold text-foreground sm:text-lg">{title}</h3>
              <p className="relative mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
