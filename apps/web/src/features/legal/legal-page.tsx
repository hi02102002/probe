import type { ReactNode } from 'react'
import { LanguageSelector } from '@/components/language-selector'
import { LocalizedLink } from '@/components/localized-link'
import { LocalizedLogo } from '@/components/localized-logo'

export interface LegalSection {
  content: ReactNode
  title: string
}

export interface LegalPageProps {
  backToHomeLabel?: string
  copyrightText?: string
  description: string
  eyebrow?: string
  lastUpdatedDate: string
  lastUpdatedLabel?: string
  privacyNavLabel?: string
  sections: LegalSection[]
  termsNavLabel?: string
  title: string
}

export function LegalPage({
  backToHomeLabel = 'Back to home',
  copyrightText = '© 2026 Probe. All rights reserved.',
  description,
  eyebrow = 'Legal',
  lastUpdatedDate,
  lastUpdatedLabel = 'Last updated:',
  privacyNavLabel = 'Privacy',
  sections,
  termsNavLabel = 'Terms',
  title,
}: LegalPageProps) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <LocalizedLogo />
          <nav aria-label="Legal pages" className="flex items-center gap-5 text-sm text-muted-foreground">
            <LocalizedLink activeProps={{ className: 'text-foreground' }} className="transition-colors hover:text-foreground" to="/terms">
              {termsNavLabel}
            </LocalizedLink>
            <LocalizedLink activeProps={{ className: 'text-foreground' }} className="transition-colors hover:text-foreground" to="/privacy">
              {privacyNavLabel}
            </LocalizedLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <p className="text-sm font-medium text-primary">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          {lastUpdatedLabel}
          {' '}
          <time dateTime="2026-08-30">{lastUpdatedDate}</time>
        </p>

        <div className="mt-12 space-y-10">
          {sections.map(section => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
              <div className="mt-3 space-y-4 leading-7 text-muted-foreground">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copyrightText}</p>
          <div className="flex items-center gap-4">
            <LanguageSelector align="end" />
            <LocalizedLink className="transition-colors hover:text-foreground" to="/">
              {backToHomeLabel}
            </LocalizedLink>
          </div>
        </div>
      </footer>
    </div>
  )
}
