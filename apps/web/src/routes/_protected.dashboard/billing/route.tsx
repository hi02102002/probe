import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getBillingStatus } from '@/features/billing/api/billing-status'
import { generateAppSeo } from '@/lib/seo'
import { BillingPage } from './_components/billing-page'

export const Route = createFileRoute('/_protected/dashboard/billing')({
  component: BillingRouteComponent,
  validateSearch: z.object({
    checkout: z.string().optional().catch(undefined),
  }),
  loader: async () => {
    return { billingStatus: await getBillingStatus() }
  },
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
  const { billingStatus } = Route.useLoaderData()

  return <BillingPage billingConfigured={billingStatus.configured} checkoutCompleted={checkout === 'success'} />
}
