import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'

export function HomeFooter() {
  return (
    <footer className="mx-auto grid max-w-6xl gap-10 border-x border-border px-6 py-12 sm:px-10 md:grid-cols-[1.5fr_1fr_1fr]">
      <div className="flex flex-col justify-between">
        <div>
          <Logo classNames={{ container: 'text-foreground' }} />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
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
        <p className="text-sm font-semibold text-foreground">Product</p>
        <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-muted-foreground">
          <a className="hover:text-foreground" href="#features">Inspect</a>
          <a className="hover:text-foreground" href="#compare">How it works</a>
          <a className="hover:text-foreground" href="#pricing">Start</a>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">Account</p>
        <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-muted-foreground">
          <Link className="hover:text-foreground" to="/login">Sign in</Link>
          <Link className="hover:text-foreground" to="/dashboard">Start debugging</Link>
        </div>
      </div>
    </footer>
  )
}
