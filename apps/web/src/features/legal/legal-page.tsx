import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/logo'

interface LegalSection {
  content: ReactNode
  title: string
}

interface LegalPageProps {
  description: string
  lastUpdated: string
  sections: LegalSection[]
  title: string
}

export function LegalPage({
  description,
  lastUpdated,
  sections,
  title,
}: LegalPageProps) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Logo />
          <nav aria-label="Legal pages" className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link activeProps={{ className: 'text-foreground' }} className="transition-colors hover:text-foreground" to="/terms">
              Terms
            </Link>
            <Link activeProps={{ className: 'text-foreground' }} className="transition-colors hover:text-foreground" to="/privacy">
              Privacy
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <p className="text-sm font-medium text-lime-400">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated:
          {' '}
          {lastUpdated}
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
    </div>
  )
}
