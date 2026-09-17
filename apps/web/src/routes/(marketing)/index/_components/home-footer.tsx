import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { getAuthSessionQueryOptions } from '@/features/auth/api/auth-session'

export function HomeFooter() {
  const { data: session } = useQuery(getAuthSessionQueryOptions)

  return (
    <footer className="mx-auto max-w-6xl border-border border-x px-6 py-12 sm:px-10">
      <h2 className="sr-only">Footer</h2>
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo
            classNames={{ container: 'text-foreground' }}
            data-umami-event="Footer logo clicked"
            data-umami-event-button-name="home__footer__logo"
          />
          <p className="mt-4 max-w-sm text-muted-foreground text-sm leading-6">
            A focused webhook debugger for capturing incoming requests and understanding exactly what was sent.
          </p>
        </div>
        <nav aria-label="Product Links">
          <h3 className="font-semibold text-foreground text-sm">Product</h3>
          <div className="mt-4 flex flex-col items-start gap-2.5 text-muted-foreground text-sm">
            <a
              className="hover:text-foreground"
              data-umami-event="Footer nav features clicked"
              data-umami-event-button-name="home__footer__nav-features"
              href="/#features"
            >
              Inspect
            </a>
            <a
              className="hover:text-foreground"
              data-umami-event="Footer nav compare clicked"
              data-umami-event-button-name="home__footer__nav-compare"
              href="/#compare"
            >
              How it works
            </a>
            <a
              className="hover:text-foreground"
              data-umami-event="Footer nav faq clicked"
              data-umami-event-button-name="home__footer__nav-faq"
              href="/#faq"
            >
              FAQ
            </a>
            <a
              className="hover:text-foreground"
              data-umami-event="Footer nav pricing clicked"
              data-umami-event-button-name="home__footer__nav-pricing"
              href="/#pricing"
            >
              Pricing
            </a>
            <Link
              className="hover:text-foreground"
              data-umami-event="Footer nav blog clicked"
              data-umami-event-button-name="home__footer__nav-blog"
              to="/blog"
            >
              Blog
            </Link>
          </div>
        </nav>
        <nav aria-label="Account Links">
          <h3 className="font-semibold text-foreground text-sm">Account</h3>
          <div className="mt-4 flex flex-col items-start gap-2.5 text-muted-foreground text-sm">
            {session?.user
              ? (
                  <Link
                    className="hover:text-foreground"
                    data-umami-event="Footer dashboard link clicked"
                    data-umami-event-button-name="home__footer__dashboard"
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                )
              : (
                  <Link
                    className="hover:text-foreground"
                    data-umami-event="Footer sign in link clicked"
                    data-umami-event-button-name="home__footer__sign-in"
                    to="/login"
                  >
                    Sign in
                  </Link>
                )}
            <Link
              className="hover:text-foreground"
              data-umami-event="Footer start debugging link clicked"
              data-umami-event-button-name="home__footer__start-debugging"
              to="/dashboard"
            >
              Start debugging
            </Link>
          </div>
        </nav>
        <nav aria-label="Legal Links">
          <h3 className="font-semibold text-foreground text-sm">Legal</h3>
          <div className="mt-4 flex flex-col items-start gap-2.5 text-muted-foreground text-sm">
            <Link
              className="hover:text-foreground"
              data-umami-event="Footer legal terms clicked"
              data-umami-event-button-name="home__footer__legal-terms"
              to="/terms"
            >
              Terms of Service
            </Link>
            <Link
              className="hover:text-foreground"
              data-umami-event="Footer legal privacy clicked"
              data-umami-event-button-name="home__footer__legal-privacy"
              to="/privacy"
            >
              Privacy Policy
            </Link>
          </div>
        </nav>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-[11px] text-muted-foreground">
          © 2026 Probe. Built for clearer webhook debugging.
        </p>
        <ThemeToggle size="sm" />
      </div>
    </footer>
  )
}
