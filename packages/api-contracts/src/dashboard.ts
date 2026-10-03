import { oc } from '@orpc/contract'
import {
  GetDashboardStatsOutputSchema,
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
