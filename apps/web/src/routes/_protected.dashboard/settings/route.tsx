import { createFileRoute } from '@tanstack/react-router'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/_protected/dashboard/settings')({
  component: () => null,
  head: () => generateAppSeo({
    description: 'Account and application settings.',
    pathname: '/dashboard/settings',
    robots: {
      follow: false,
      index: false,
    },
    title: 'Settings',
  }),
})
