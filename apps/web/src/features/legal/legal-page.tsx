import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/logo'

export interface LegalSection {
  content: ReactNode
  title: string
}

export interface LegalPageProps {
  type?: 'privacy' | 'terms'
}

const PRIVACY_SECTIONS: LegalSection[] = [
  {
    content: (
      <>
        <p>
          We collect minimal information required to provide our webhook debugging services, including account details and temporarily captured webhook payloads.
        </p>
        <p>
          Captured request payloads are stored temporarily and automatically expired according to your data retention settings.
        </p>
      </>
    ),
    title: 'Information We Collect',
  },
  {
    content: (
      <>
        <p>
          Your data is used strictly to provide, debug, and improve our services. We never sell your personal or webhook payload data to third parties.
        </p>
      </>
    ),
    title: 'How We Use Information',
  },
  {
    content: (
      <>
        <p>
          All data in transit is encrypted using TLS 1.3. Payloads and sensitive headers are protected with strict access control policies.
        </p>
      </>
    ),
    title: 'Security',
  },
]

const TERMS_SECTIONS: LegalSection[] = [
  {
    content: (
      <>
        <p>
          By accessing or using Probe, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
        </p>
      </>
    ),
    title: 'Acceptance of Terms',
  },
  {
    content: (
      <>
        <p>
          You are responsible for safeguarding your authentication credentials and endpoint URLs. You agree not to use the service for illegal or unauthorized activities.
        </p>
      </>
    ),
    title: 'Acceptable Use',
  },
  {
    content: (
      <>
        <p>
          The service is provided &quot;as is&quot; without warranties of any kind. We reserve the right to modify or discontinue service with reasonable notice.
        </p>
      </>
    ),
    title: 'Disclaimer & Limitation of Liability',
  },
]

export function LegalPage({ type = 'terms' }: LegalPageProps) {
  const isPrivacy = type === 'privacy'
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service'
  const description = isPrivacy
    ? 'How we handle your data, webhook payloads, and privacy.'
    : 'Rules and guidelines for using the Probe webhook debugging platform.'
  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS

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
        <p className="text-sm font-medium text-primary">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated:
          {' '}
          <time dateTime="2026-08-30">August 30, 2026</time>
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
          <p>© 2026 Probe. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link className="transition-colors hover:text-foreground" to="/">
              Back to home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
