import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'

export function HomePage() {
  return (
    <main className="dark min-h-svh bg-background text-foreground">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <Button render={<Link to="/login" />} variant="outline">
          Sign in
        </Button>
      </header>
      <section className="mx-auto flex max-w-6xl flex-col items-start px-6 py-24 sm:py-32">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-lime-300">
          Webhook debugging SaaS
          Probe
        </p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">
          Capture requests. Inspect every detail.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Clean starter with TanStack Start, Hono, oRPC, Better Auth, Drizzle and PostgreSQL ready for the product layer.
        </p>
        <Button className="mt-8" render={<Link to="/dashboard" />} variant="accent">
          Open dashboard
        </Button>
      </section>
    </main>
  )
}
