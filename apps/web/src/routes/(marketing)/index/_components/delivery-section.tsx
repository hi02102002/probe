import type { ReactNode } from 'react'
import { CheckIcon, LightningIcon, WebhooksLogoIcon, XIcon } from '@phosphor-icons/react'

const PATHS = [
  'M 72,132 C 150,56 266,56 344,132',
  'M 72,144 C 150,144 266,144 344,144',
  'M 72,156 C 150,232 266,232 344,156',
]

function FlowDot({ motionTimes, opacityTimes, path }: { motionTimes: string, opacityTimes: string, path: string }) {
  return (
    <g className="probe-delivery-flow text-primary">
      <circle r="5" fill="currentColor">
        <animate attributeName="opacity" dur="7.8s" keyTimes={opacityTimes} repeatCount="indefinite" values="0;0.18;0.18;0;0" />
        <animateMotion calcMode="linear" dur="7.8s" keyPoints="0;0;1;1" keyTimes={motionTimes} path={path} repeatCount="indefinite" />
      </circle>
      <circle r="2.25" fill="currentColor">
        <animate attributeName="opacity" dur="7.8s" keyTimes={opacityTimes} repeatCount="indefinite" values="0;1;1;0;0" />
        <animateMotion calcMode="linear" dur="7.8s" keyPoints="0;0;1;1" keyTimes={motionTimes} path={path} repeatCount="indefinite" />
      </circle>
    </g>
  )
}

function Attempt({
  badge,
  className,
  icon,
  label,
  tone,
}: {
  badge: ReactNode
  className: string
  icon: ReactNode
  label: ReactNode
  tone: 'error' | 'success'
}) {
  const toneClasses = tone === 'success'
    ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400'
    : 'bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400'

  return (
    <div className={`probe-delivery-attempt flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-2 shadow-sm ring-2 ring-background ${className}`}>
      <span className={`flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${toneClasses}`}>
        {icon}
      </span>
      <span className="whitespace-nowrap font-medium text-[10px] text-foreground leading-none">{label}</span>
      <span className={`inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 font-mono font-semibold text-[9px] leading-none ring-1 ring-inset ${toneClasses}`}>
        {badge}
      </span>
    </div>
  )
}

function DeliveryDiagram() {
  return (
    <div className="relative aspect-[13/9] w-full max-w-[26rem]" aria-hidden="true">
      <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 416 288" fill="none">
        {PATHS.map(path => (
          <path key={path} d={path} stroke="currentColor" strokeLinecap="round" strokeWidth="0.75" className="text-border" />
        ))}
        <FlowDot motionTimes="0;0.02;0.28;1" opacityTimes="0;0.02;0.26;0.28;1" path={PATHS[0]} />
        <FlowDot motionTimes="0;0.35;0.61;1" opacityTimes="0;0.35;0.59;0.61;1" path={PATHS[1]} />
        <FlowDot motionTimes="0;0.68;0.94;1" opacityTimes="0;0.68;0.92;0.94;1" path={PATHS[2]} />
      </svg>

      <div className="absolute left-1/2 top-[8.33%] -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-2 shadow-sm ring-2 ring-background">
          <LightningIcon className="size-3.5 shrink-0 text-accent-foreground" weight="fill" />
          <span className="font-medium text-[11px] text-foreground leading-none">payment.succeeded</span>
          <span className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 px-1 font-mono font-semibold text-[9px] text-accent-foreground leading-none ring-1 ring-primary/15 ring-inset">evt_8kPz</span>
        </div>
      </div>

      <div className="absolute left-[10.58%] top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-2 ring-background">
          <LightningIcon className="size-5" weight="fill" />
        </div>
      </div>

      <div className="absolute left-[89.42%] top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm ring-2 ring-background">
          <WebhooksLogoIcon className="size-5" />
        </div>
      </div>

      <div className="absolute left-1/2 top-[26.04%] -translate-x-1/2 -translate-y-1/2">
        <Attempt
          badge="502"
          className="probe-delivery-attempt-one"
          icon={<XIcon className="size-2.5" weight="bold" />}
          label="Bad Gateway"
          tone="error"
        />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Attempt
          badge="···"
          className="probe-delivery-attempt-two"
          icon={<XIcon className="size-2.5" weight="bold" />}
          label="Timed out"
          tone="error"
        />
      </div>
      <div className="absolute left-1/2 top-[73.96%] -translate-x-1/2 -translate-y-1/2">
        <Attempt
          badge="200"
          className="probe-delivery-attempt-three"
          icon={<CheckIcon className="size-2.5" weight="bold" />}
          label="Delivered"
          tone="success"
        />
      </div>

      <p className="probe-delivery-result absolute left-1/2 top-[94.44%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] text-muted-foreground">
        Delivered after 3 attempts · 10.2s
      </p>
    </div>
  )
}

export function DeliverySection() {
  return (
    <section className="grid border-b border-border lg:grid-cols-[0.85fr_1.15fr]">
      <div className="flex flex-col justify-center px-6 py-14 sm:px-10 lg:border-r lg:border-border lg:py-20">
        <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">See how each attempt ended.</h2>
        <p className="mt-5 max-w-md leading-7 text-muted-foreground">Track consecutive webhook delivery attempts from 504 gateway timeouts or 400 Bad Request validation errors through to the final 200 OK delivery with per-attempt latencies.</p>
      </div>
      <div className="flex min-h-80 items-center justify-center overflow-hidden border-t border-border bg-card/20 px-4 py-8 lg:border-t-0 sm:px-8">
        <DeliveryDiagram />
      </div>
    </section>
  )
}
