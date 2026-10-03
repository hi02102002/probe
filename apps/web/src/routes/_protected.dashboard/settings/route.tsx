import { createFileRoute } from '@tanstack/react-router'
import { generateAppSeo } from '@/lib/seo'
import { SettingsPage } from './_components/settings-page'

export const Route = createFileRoute('/_protected/dashboard/settings')({
  component: SettingsPage,
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
