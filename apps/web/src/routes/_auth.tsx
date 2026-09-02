import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context, search }) => {
    if (context.session) {
      if (search.redirect) {
        throw redirect({ href: search.redirect })
      }

      throw redirect({
        to: '/dashboard',
      })
    }

    return { session: context.session }
  },
  component: AuthLayout,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
})

function AuthLayout() {
  return (
    <main className="flex h-svh overflow-hidden bg-background font-sans text-foreground">
      <section className="relative flex min-h-0 w-full flex-col overflow-y-auto border-border bg-card px-6 py-6 lg:w-[40%] lg:min-w-[480px] lg:border-r lg:px-16 xl:min-w-[560px]">
        <div className="flex items-center justify-between">
          <Logo />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <Outlet />
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-center text-muted-foreground text-xs leading-5">
            By continuing, you agree to our
            {' '}
            <Link className="text-foreground underline underline-offset-4" to="/terms">
              Terms of Service
            </Link>
            {' '}
            and acknowledge our
            {' '}
            <Link className="text-foreground underline underline-offset-4" to="/privacy">
              Privacy Policy
            </Link>
            .
          </p>
          <ThemeToggle size="sm" />
        </div>
      </section>

      <section className="relative hidden min-h-0 flex-1 overflow-hidden bg-muted/40 lg:block">
        <div
          aria-hidden="true"
          className="absolute -left-[26rem] top-1/2 size-[58rem] -translate-y-1/2 rounded-full border border-border/40 bg-[repeating-radial-gradient(circle_at_center,transparent_0,transparent_5.7rem,color-mix(in_srgb,var(--border)_70%,transparent)_5.75rem,transparent_5.9rem)]"
        >
          <div className="absolute inset-[16%] rounded-full border border-border/40" />
          <div className="absolute inset-[34%] rounded-full border border-border/40" />
          <div className="absolute left-1/2 top-1/2 h-px w-1/2 origin-left rotate-[22deg] bg-border/40" />
          <div className="absolute left-1/2 top-1/2 h-px w-1/2 origin-left -rotate-[38deg] bg-border/40" />
        </div>
        <div className="absolute left-1/2 top-1/2 w-[min(92%,42rem)] -translate-x-1/2 -translate-y-1/2">
          <p className="mb-5 font-semibold text-indigo-600 text-xs tracking-wider uppercase dark:text-indigo-400">
            Probe
          </p>
          <h2 className="font-semibold text-3xl text-foreground tracking-tight lg:text-4xl xl:text-5xl">
            Capture webhooks.
            <br />
            <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-indigo-600 dark:bg-indigo-400/20 dark:text-indigo-300">Inspect everything.</span>
          </h2>
          <p className="mt-6 max-w-lg text-base text-muted-foreground">
            Get a unique endpoint, send any webhook to it, and inspect headers, query parameters, and payloads in real time.
          </p>
        </div>
      </section>
    </main>
  )
}
