import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/features/legal'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/(marketing)/privacy')({
  component: () => <LegalPage type="privacy" />,
  head: () => generateAppSeo({
    description: 'Privacy Policy for Probe.',
    pathname: '/privacy',
    title: 'Privacy Policy',
  }),
})
