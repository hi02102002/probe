import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { getAuthSessionQueryOptions } from '@/features/auth/api/auth-session'

export function HomeFooter() {
  const { data: session } = useQuery(getAuthSessionQueryOptions)

  return (
    <footer className="mx-auto grid max-w-6xl gap-10 border-border border-x px-6 py-12 sm:px-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div className="flex flex-col justify-between">
        <div>
          <Logo classNames={{ container: 'text-foreground' }} />
          <p className="mt-4 max-w-sm text-muted-foreground text-sm leading-6">
            A focused webhook debugger for capturing incoming requests and understanding exactly what was sent.
          </p>
        </div>
        <div className="mt-6">
          <ThemeToggle size="sm" />
        </div>
        <p className="mt-6 font-mono text-[11px] text-muted-foreground">
          © 2026 Probe. Built for clearer webhook debugging.
        </p>
      </div>
      <div>
        <p className="font-semibold text-foreground text-sm">Product</p>
        <div className="mt-4 flex flex-col items-start gap-2.5 text-muted-foreground text-sm">
          <a className="hover:text-foreground" href="/#features">Inspect</a>
          <a className="hover:text-foreground" href="/#compare">How it works</a>
          <a className="hover:text-foreground" href="/#pricing">Pricing</a>
        </div>
      </div>
      <div>
        <p className="font-semibold text-foreground text-sm">Account</p>
        <div className="mt-4 flex flex-col items-start gap-2.5 text-muted-foreground text-sm">
          {session?.user
            ? (
                <Link className="hover:text-foreground" to="/dashboard">Dashboard</Link>
              )
            : (
                <Link className="hover:text-foreground" to="/login">Sign in</Link>
              )}
          <Link className="hover:text-foreground" to="/dashboard">Start debugging</Link>
        </div>
      </div>
      <div>
        <p className="font-semibold text-foreground text-sm">Legal</p>
        <div className="mt-4 flex flex-col items-start gap-2.5 text-muted-foreground text-sm">
          <Link className="hover:text-foreground" to="/terms">Terms of Service</Link>
          <Link className="hover:text-foreground" to="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}
