import { useIntlayer } from 'react-intlayer'
import { LanguageSelector } from '@/components/language-selector'
import { LocalizedLink } from '@/components/localized-link'
import { LocalizedLogo } from '@/components/localized-logo'
import { Button } from '@/components/ui/button'

export function HomePage() {
  const content = useIntlayer('home')

  return (
    <main className="dark min-h-svh bg-background text-foreground">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <LocalizedLogo />
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <Button render={<LocalizedLink to="/login" />} variant="outline">
            {content.signIn}
          </Button>
        </div>
      </header>
      <section className="mx-auto flex max-w-6xl flex-col items-start px-6 py-24 sm:py-32">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-lime-300">
          {content.badge}
        </p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">
          {content.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {content.description}
        </p>
        <Button className="mt-8" render={<LocalizedLink to="/dashboard" />} variant="accent">
          {content.openDashboard}
        </Button>
      </section>
    </main>
  )
}
