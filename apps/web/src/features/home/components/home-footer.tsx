import { useIntlayer } from 'react-intlayer'
import { LanguageSelector } from '@/components/language-selector'
import { LocalizedLink } from '@/components/localized-link'
import { LocalizedLogo } from '@/components/localized-logo'

export function HomeFooter() {
  const content = useIntlayer('home')

  return (
    <footer className="mx-auto grid max-w-6xl gap-10 border-x border-border px-6 py-12 sm:px-10 md:grid-cols-[1.5fr_1fr_1fr]">
      <div>
        <LocalizedLogo classNames={{ container: 'text-foreground' }} />
        <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{content.footerDescription}</p>
        <div className="mt-6">
          <LanguageSelector align="start" />
        </div>
        <p className="mt-6 font-mono text-[11px] text-muted-foreground">
          © 2026 Probe.
          {' '}
          {content.rights}
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{content.productFooter}</p>
        <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-muted-foreground">
          <a className="hover:text-foreground" href="#features">{content.featuresNav}</a>
          <a className="hover:text-foreground" href="#compare">{content.compareNav}</a>
          <a className="hover:text-foreground" href="#pricing">{content.pricingNav}</a>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{content.accountFooter}</p>
        <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-muted-foreground">
          <LocalizedLink className="hover:text-foreground" to="/login">{content.signIn}</LocalizedLink>
          <LocalizedLink className="hover:text-foreground" to="/dashboard">{content.openDashboard}</LocalizedLink>
        </div>
      </div>
    </footer>
  )
}
