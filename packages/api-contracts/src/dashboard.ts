import { oc } from '@orpc/contract'
import {
  GetDashboardStatsOutputSchema,
  GetDashboardTrendOutputSchema,
  ListDashboardRecentRequestsInputSchema,
  ListDashboardRecentRequestsOutputSchema,
} from '@repo/schemas/dashboard'
import { z } from 'zod'

const tags = ['Dashboard'] as const

export const dashboardContract = {
  stats: oc
    .route({
      description: 'Aggregated usage stats for the signed-in user',
      inputStructure: 'detailed',
      method: 'GET',
      path: '/dashboard/stats',
      summary: 'Get dashboard stats',
      tags,
    })
    .input(z.object({}))
    .output(GetDashboardStatsOutputSchema),
  trend: oc
    .route({
      description: 'Hourly captured request counts for the last 24 hours of the signed-in user',
      inputStructure: 'detailed',
      method: 'GET',
      path: '/dashboard/trend',
      summary: 'Get request trend for the last 24 hours',
      tags,
    })
    .input(z.object({}))
    .output(GetDashboardTrendOutputSchema),
  recentRequests: oc
    .route({
      description: 'Most recently captured requests across all endpoints of the signed-in user',
      inputStructure: 'detailed',
      method: 'GET',
      path: '/dashboard/recent-requests',
      summary: 'List recent requests across endpoints',
      tags,
    })
    .input(ListDashboardRecentRequestsInputSchema)
    .output(ListDashboardRecentRequestsOutputSchema),
}
