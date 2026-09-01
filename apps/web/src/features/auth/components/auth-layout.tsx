import { Outlet } from '@tanstack/react-router'
import { LocalizedLink } from '@/components/localized-link'
import { LocalizedLogo } from '@/components/localized-logo'

export function AuthLayout() {
  return (
    <main className="dark flex h-svh overflow-hidden bg-background font-sans text-foreground">
      <section className="relative flex min-h-0 w-full flex-col overflow-y-auto border-white/10 bg-card px-6 py-6 lg:w-[40%] lg:min-w-[480px] lg:border-r lg:px-16 xl:min-w-[560px]">
        <div>
          <LocalizedLogo />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <Outlet />
        </div>

        <p className="text-center text-muted-foreground text-xs leading-5">
          By continuing, you agree to our
          {' '}
          <LocalizedLink className="text-foreground underline underline-offset-4" to="/terms">
            Terms of Service
          </LocalizedLink>
          {' '}
          and acknowledge our
          {' '}
          <LocalizedLink className="text-foreground underline underline-offset-4" to="/privacy">
            Privacy Policy
          </LocalizedLink>
          .
        </p>
      </section>

      <section className="relative hidden min-h-0 flex-1 overflow-hidden lg:block">
        <div
          aria-hidden="true"
          className="absolute -left-[26rem] top-1/2 size-[58rem] -translate-y-1/2 rounded-full border border-white/[0.05] bg-[repeating-radial-gradient(circle_at_center,transparent_0,transparent_5.7rem,rgba(255,255,255,0.035)_5.75rem,transparent_5.9rem)]"
        >
          <div className="absolute inset-[16%] rounded-full border border-white/[0.05]" />
          <div className="absolute inset-[34%] rounded-full border border-white/[0.05]" />
          <div className="absolute left-1/2 top-1/2 h-px w-1/2 origin-left rotate-[22deg] bg-white/[0.05]" />
          <div className="absolute left-1/2 top-1/2 h-px w-1/2 origin-left -rotate-[38deg] bg-white/[0.05]" />
        </div>
        <div className="absolute left-1/2 top-1/2 w-[min(92%,42rem)] -translate-x-1/2 -translate-y-1/2">
          <p className="mb-5 text-xs font-medium tracking-wide text-indigo-300 uppercase">
            Probe
          </p>
          <h2 className="text-3xl font-medium text-foreground lg:text-4xl xl:text-5xl">
            Capture webhooks.
            <br />
            <span className="bg-indigo-400 px-1.5 text-primary-foreground">Inspect everything.</span>
          </h2>
          <p className="mt-6 max-w-lg text-base text-muted-foreground">
            Get a unique endpoint, send any webhook to it, and inspect
            headers, query parameters, and payloads in real time.
          </p>
        </div>
      </section>
    </main>
  )
}
