import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '@/features/dashboard'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/_protected/dashboard/')({
  component: DashboardPage,
  head: () => generateAppSeo({
    description: 'Protected Probe dashboard.',
    pathname: '/dashboard',
    robots: {
      follow: false,
      index: false,
    },
    title: 'Endpoints',
  }),
})
