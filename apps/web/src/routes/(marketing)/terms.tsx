import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/features/legal'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/(marketing)/terms')({
  component: TermsPage,
  head: () => generateAppSeo({
    description: 'Terms for Probe.',
    pathname: '/terms',
    title: 'Terms of Service',
  }),
})

function TermsPage() {
  return (
    <LegalPage
      description="Starter terms copy for the Probe application. Review and replace it before production use."
      lastUpdated="August 30, 2026"
      sections={[
        {
          title: '1. Service',
          content: <p>The service is intended to provide developer tooling for receiving, inspecting, and debugging webhook requests.</p>,
        },
        {
          title: '2. Acceptable use',
          content: <p>Users must not submit data they are not authorized to process or use the service to interfere with third-party systems.</p>,
        },
        {
          title: '3. Production review',
          content: <p>Replace this starter language with terms reviewed for your business, jurisdiction, billing model, and data-handling practices.</p>,
        },
      ]}
      title="Terms of Service"
    />
  )
}
