import { ArrowRightIcon, CheckIcon, TerminalWindowIcon } from '@phosphor-icons/react'
import { useIntlayer } from 'react-intlayer'
import { LocalizedLink } from '@/components/localized-link'
import { Button } from '@/components/ui/button'

function RequestCanvas() {
  const requests = ['POST /events', 'GET /users/24', 'POST /webhooks', 'GET /health']
  const timings = [
    ['DNS', '4ms', 'w-[12%]'],
    ['TLS', '18ms', 'w-[28%]'],
    ['Server', '51ms', 'w-[72%]'],
    ['Transfer', '11ms', 'w-[18%]'],
  ]

  return (
    <div className="relative mx-auto mt-16 max-w-4xl px-3 sm:px-8" aria-hidden="true">
      <div className="probe-glow absolute inset-x-16 -top-10 h-28 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative overflow-hidden border border-border bg-card shadow-2xl shadow-background/40">
        <div className="flex h-10 items-center justify-between border-b border-border px-4 font-mono text-[10px] text-muted-foreground sm:text-xs">
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-success" />
            <span>api.probe.dev / live</span>
          </div>
          <span>42 req/s</span>
        </div>
        <div className="grid min-h-64 grid-cols-[2.2rem_1fr] sm:grid-cols-[12rem_1fr]">
          <div className="border-r border-border bg-muted/20 px-2 py-4 sm:px-3">
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">Recent requests</p>
            <div className="mt-3 space-y-1.5">
              {requests.map((request, index) => (
                <div key={request} className={`flex h-8 items-center gap-2 border px-1.5 font-mono text-[10px] ${index === 0 ? 'border-primary/25 bg-primary/10 text-accent-foreground' : 'border-transparent text-muted-foreground'}`}>
                  <span className={`size-1.5 shrink-0 rounded-full ${index === 2 ? 'bg-warning' : 'bg-success'}`} />
                  <span className="hidden truncate sm:block">{request}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden p-4 sm:p-6">
            <div className="probe-scan absolute inset-x-0 top-0 h-px" />
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-xs">
              <span className="bg-chart-2/15 px-2 py-1 text-chart-2">POST</span>
              <span className="text-foreground">/v1/events</span>
              <span className="ml-auto text-success-foreground">201 Created</span>
              <span className="text-muted-foreground">84ms</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="border border-border bg-code p-4 font-mono text-[10px] leading-5 sm:text-xs">
                <p className="mb-2 text-muted-foreground">REQUEST BODY</p>
                <p className="text-muted-foreground">{'{'}</p>
                <p className="pl-3">
                  <span className="text-chart-4">&quot;event&quot;</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-warning-foreground">&quot;checkout.done&quot;</span>
                  ,
                </p>
                <p className="pl-3">
                  <span className="text-chart-4">&quot;amount&quot;</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-chart-2">14900</span>
                  ,
                </p>
                <p className="pl-3">
                  <span className="text-chart-4">&quot;currency&quot;</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-warning-foreground">&quot;USD&quot;</span>
                </p>
                <p className="text-muted-foreground">{'}'}</p>
              </div>
              <div className="space-y-2 font-mono text-[10px] sm:text-xs">
                {timings.map(([label, value, width]) => (
                  <div key={label} className="grid grid-cols-[3rem_1fr_2.5rem] items-center gap-2 text-muted-foreground">
                    <span>{label}</span>
                    <span className="h-1 bg-muted"><span className={`block h-full bg-primary/70 ${width}`} /></span>
                    <span className="text-right text-foreground">{value}</span>
                  </div>
                ))}
                <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-success-foreground">
                  <CheckIcon weight="bold" />
                  <span>Schema validated</span>
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
  const content = useIntlayer('home')

  return (
    <section className="relative isolate overflow-hidden border-b border-border px-4 pb-16 pt-24 sm:px-8 sm:pb-24 sm:pt-32">
      <div className="probe-hero-glow absolute inset-x-0 -top-32 -z-10 mx-auto h-96 max-w-3xl" />
      <div className="mx-auto max-w-4xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 border border-border bg-card/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
          <span className="size-1.5 rounded-full bg-success shadow-[0_0_10px_var(--success)]" />
          {content.badge}
        </div>
        <h1 className="text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
          {content.title}
          {' '}
          <span className="text-accent-foreground">{content.titleAccent}</span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-xl sm:leading-8">{content.description}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button render={<LocalizedLink to="/dashboard" />} size="xl">
            {content.openDashboard}
            <ArrowRightIcon weight="bold" />
          </Button>
          <Button
            render={<a href="#features" aria-label={String(content.seeHow)} />}
            size="xl"
            variant="outline"
          >
            <TerminalWindowIcon />
            {content.seeHow}
          </Button>
        </div>
      </div>
      <RequestCanvas />
    </section>
  )
}
