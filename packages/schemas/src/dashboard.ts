import { z } from 'zod'
import { WebhookRequestSummarySchema } from './wh-request.js'

export const DashboardStatsSchema = z.object({
  endpoints: z.number().int().describe('Total endpoints owned by the user'),
  activeEndpoints: z.number().int().describe('Endpoints currently accepting requests'),
  requests24h: z.number().int().describe('Captured requests in the last 24 hours'),
  requests7d: z.number().int().describe('Captured requests in the last 7 days'),
})

export const DashboardRequestSummarySchema = WebhookRequestSummarySchema.extend({
  endpointName: z.string().describe('Name of the endpoint that captured the request'),
})

export const DashboardTrendPointSchema = z.object({
  hour: z.string().describe('ISO timestamp of the start of the UTC hour bucket'),
  total: z.number().int().describe('Requests captured during this hour bucket'),
})

export const GetDashboardStatsOutputSchema = z.object({
  stats: DashboardStatsSchema,
})

export const GetDashboardTrendOutputSchema = z.object({
  points: z.array(DashboardTrendPointSchema).length(24),
})

export const ListDashboardRecentRequestsInputSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
})

export const ListDashboardRecentRequestsOutputSchema = z.object({
  items: z.array(DashboardRequestSummarySchema),
})

export type DashboardStats = z.infer<typeof DashboardStatsSchema>
export type DashboardRequestSummary = z.infer<typeof DashboardRequestSummarySchema>
export type DashboardTrendPoint = z.infer<typeof DashboardTrendPointSchema>
export type GetDashboardStatsOutput = z.infer<typeof GetDashboardStatsOutputSchema>
export type GetDashboardTrendOutput = z.infer<typeof GetDashboardTrendOutputSchema>
export type ListDashboardRecentRequestsInput = z.infer<typeof ListDashboardRecentRequestsInputSchema>
export type ListDashboardRecentRequestsOutput = z.infer<typeof ListDashboardRecentRequestsOutputSchema>
