import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

function RequestCanvas() {
  const requests = ['POST  Stripe', 'POST  GitHub', 'POST  Shopify', 'GET   Test ping']

  return (
    <div className="relative mx-auto mt-16 max-w-4xl px-3 sm:px-8" aria-hidden="true">
      <div className="probe-glow absolute inset-x-16 -top-10 h-28 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative overflow-hidden border border-border bg-card shadow-2xl shadow-background/40">
        <div className="flex h-10 items-center justify-between border-b border-border px-4 font-mono text-[10px] text-muted-foreground sm:text-xs">
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-success" />
            <span>Your endpoint is ready</span>
          </div>
          <span>4 requests captured</span>
        </div>
        <div className="grid min-h-64 grid-cols-[2.2rem_1fr] sm:grid-cols-[12rem_1fr]">
          <div className="border-r border-border bg-muted/20 px-2 py-4 sm:px-3">
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">Incoming webhooks</p>
            <div className="mt-3 space-y-1.5">
              {requests.map((request, index) => (
                <div key={request} className={`flex h-8 items-center gap-2 border px-1.5 font-mono text-[10px] ${index === 0 ? 'border-primary/25 bg-primary/10 text-accent-foreground' : 'border-transparent text-foreground/70'}`}>
                  <span className={`size-1.5 shrink-0 rounded-full ${index === 2 ? 'bg-warning' : 'bg-success'}`} />
                  <span className="hidden truncate sm:block">{request}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden p-4 sm:p-6">
            <div className="probe-scan absolute inset-x-0 top-0 h-px" />
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-xs">
              <span className="bg-violet-500/15 px-2 py-1 text-violet-700 dark:text-violet-300">POST</span>
              <span className="text-foreground">/hooks/ep_checkout</span>
              <span className="ml-auto text-success-foreground">200 OK</span>
              <span className="text-foreground/70">Received just now</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="border border-border bg-code p-4 font-mono text-[10px] leading-5 sm:text-xs">
                <p className="mb-2 text-foreground/70">Request body</p>
                <p className="text-muted-foreground">{'{'}</p>
                <p className="pl-3">
                  <span className="text-chart-4">&quot;type&quot;</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-warning-foreground">&quot;checkout.completed&quot;</span>
                  ,
                </p>
                <p className="pl-3">
                  <span className="text-chart-4">&quot;order_id&quot;</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-warning-foreground">&quot;ord_1042&quot;</span>
                  ,
                </p>
                <p className="pl-3">
                  <span className="text-chart-4">&quot;amount&quot;</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-chart-2">14900</span>
                </p>
                <p className="text-muted-foreground">{'}'}</p>
              </div>
              <div className="font-mono text-[10px] sm:text-xs">
                <p className="mb-3 text-foreground/70">Request headers</p>
                <dl className="space-y-3">
                  <div className="grid grid-cols-[5rem_1fr] gap-2">
                    <dt className="text-foreground/70">content-type</dt>
                    <dd className="truncate text-foreground">application/json</dd>
                  </div>
                  <div className="grid grid-cols-[5rem_1fr] gap-2">
                    <dt className="text-foreground/70">user-agent</dt>
                    <dd className="truncate text-foreground">Stripe/1.0</dd>
                  </div>
                  <div className="grid grid-cols-[5rem_1fr] gap-2">
                    <dt className="text-foreground/70">x-signature</dt>
                    <dd className="truncate text-foreground">t=1788,v1=3fd92...</dd>
                  </div>
                </dl>
                <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-success-foreground">
                  <CheckIcon weight="bold" />
                  <span>4 requests captured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden border-b border-border px-4 pb-16 pt-24 sm:px-8 sm:pb-24 sm:pt-32">
      <div className="probe-hero-glow absolute inset-x-0 -top-32 -z-10 mx-auto h-96 max-w-3xl" />
      <div className="mx-auto max-w-4xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 border border-border bg-card/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
          <span className="size-1.5 rounded-full bg-success shadow-[0_0_10px_var(--success)]" />
          Live HTTP inspection for modern engineering teams
        </div>
        <h1 className="text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
          Stop tailing server logs.
          {' '}
          <span className="text-accent-foreground">See the real payload.</span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-xl sm:leading-8">
          We built Probe after spending too many late nights wrestling with broken webhook signatures and silent serialization bugs. Generate a dedicated URL, route your third-party events into it, and inspect the unparsed headers, query strings, and raw JSON bodies as they arrive.
        </p>
        <div className="mt-10 flex justify-center">
          <Button
            data-umami-event-button-name="home__hero__start-debugging"
            data-umami-link-event="Hero start debugging clicked"
            render={<Link to="/dashboard" />}
            size="xl"
          >
            Start debugging
            <ArrowRightIcon weight="bold" />
          </Button>
        </div>
      </div>
      <RequestCanvas />
    </div>
  )
}
