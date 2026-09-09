import { ArrowRightIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { getAuthSessionQueryOptions } from '@/features/auth/api/auth-session'

export function HomeHeader() {
  const { data: session } = useQuery(getAuthSessionQueryOptions)

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl">
      <a className="flex min-h-10 items-center justify-center gap-2 bg-primary px-4 py-2 text-center font-semibold text-primary-foreground text-xs transition-colors hover:bg-primary/90 sm:text-sm" href="#pricing">
        <span>Debug your next webhook with Probe.</span>
        <ArrowRightIcon className="shrink-0" weight="bold" />
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 border-border border-b border-x px-4 sm:px-5">
        <Logo classNames={{ container: 'text-foreground' }} />
        <nav aria-label="Main Navigation" className="hidden items-center gap-1 md:flex">
          <h2 className="sr-only">Main Navigation</h2>
          <a className="px-3 py-2 text-muted-foreground text-sm transition-colors hover:text-foreground" href="#features">Inspect</a>
          <a className="px-3 py-2 text-muted-foreground text-sm transition-colors hover:text-foreground" href="#compare">How it works</a>
          <a className="px-3 py-2 text-muted-foreground text-sm transition-colors hover:text-foreground" href="#faq">FAQ</a>
          <a className="px-3 py-2 text-muted-foreground text-sm transition-colors hover:text-foreground" href="#pricing">Start</a>
        </nav>
        <div className="flex items-center gap-2">
          {session?.user
            ? (
                <Button render={<Link to="/dashboard" />}>
                  Dashboard
                </Button>
              )
            : (
                <Button render={<Link to="/login" />}>
                  Sign in
                </Button>
              )}
        </div>
      </div>
    </header>
  )
}
