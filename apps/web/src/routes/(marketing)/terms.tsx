import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/features/legal'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/(marketing)/terms')({
  component: () => <LegalPage type="terms" />,
  head: () => generateAppSeo({
    description: 'Terms of Service for Probe.',
    pathname: '/terms',
    title: 'Terms of Service',
  }),
})
