import { ArrowRightIcon } from '@phosphor-icons/react'
import { useIntlayer } from 'react-intlayer'
import { LanguageSelector } from '@/components/language-selector'
import { LocalizedLink } from '@/components/localized-link'
import { LocalizedLogo } from '@/components/localized-logo'
import { Button } from '@/components/ui/button'

export function HomeHeader() {
  const content = useIntlayer('home')

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl">
      <a className="flex min-h-10 items-center justify-center gap-2 bg-primary px-4 py-2 text-center text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:text-sm" href="#pricing">
        <span>{content.announcement}</span>
        <ArrowRightIcon className="shrink-0" weight="bold" />
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 border-x border-b border-border px-4 sm:px-5">
        <LocalizedLogo classNames={{ container: 'text-foreground' }} />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          <a className="px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground" href="#features">{content.featuresNav}</a>
          <a className="px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground" href="#compare">{content.compareNav}</a>
          <a className="px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground" href="#pricing">{content.pricingNav}</a>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button className="hidden sm:inline-flex" render={<LocalizedLink to="/login" />}>
            {content.signIn}
          </Button>
        </div>
      </div>
    </header>
  )
}
