import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { generateAppSeo } from '@/lib/seo'
import { BillingPage } from './_components/billing-page'

export const Route = createFileRoute('/_protected/dashboard/billing')({
  component: BillingRouteComponent,
  validateSearch: z.object({
    checkout: z.string().optional().catch(undefined),
  }),
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

function BillingRouteComponent() {
  const { checkout } = Route.useSearch()

  return <BillingPage checkoutCompleted={checkout === 'success'} />
}
