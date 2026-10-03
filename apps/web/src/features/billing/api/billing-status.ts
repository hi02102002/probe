import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { env } from '@/env/server'

export interface BillingStatus {
  readonly configured: boolean
}

export const getBillingStatus = createServerFn({ method: 'GET' }).handler(
  async (): Promise<BillingStatus> => {
    return {
      configured: Boolean(env.POLAR_ACCESS_TOKEN && env.POLAR_PREMIUM_PRODUCT_ID),
    }
  },
)

export const getBillingStatusQueryOptions = queryOptions({
  queryKey: ['billing-status'],
  queryFn: getBillingStatus,
})
