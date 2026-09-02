import { createFileRoute } from '@tanstack/react-router'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/_protected/dashboard/billing')({
  component: () => null,
  head: () => generateAppSeo({
    description: 'Billing and subscription management.',
    pathname: '/dashboard/billing',
    robots: {
      follow: false,
      index: false,
    },
    title: 'Billing',
  }),
})
