import { z } from 'zod'
import { WebhookRequestMethodSchema } from './wh-request.js'

export const ForwardLogSchema = z.object({
  id: z.string().describe('Unique forward log ID'),
  endpointId: z.string().describe('Associated endpoint ID'),
  method: WebhookRequestMethodSchema.describe('HTTP method used for the forward'),
  targetUrl: z.string().describe('Destination URL the request was forwarded to'),
  reqBody: z.unknown().nullable().optional().describe('Body snapshot sent to the destination'),
  statusCode: z.number().int().nullable().optional().describe('Destination response status code'),
  durationMs: z.number().int().nullable().optional().describe('Round-trip duration in milliseconds'),
  success: z.boolean().describe('Whether the destination returned a 2xx response'),
  error: z.string().nullable().optional().describe('Network error message when the forward failed'),
  createdAt: z.date().describe('Creation timestamp'),
  updatedAt: z.date().describe('Last updated timestamp'),
})

export const ForwardLogSummarySchema = ForwardLogSchema.pick({
  createdAt: true,
  durationMs: true,
  id: true,
  method: true,
  statusCode: true,
  success: true,
  targetUrl: true,
})

export const ListForwardsInputSchema = z.object({
  params: z.object({
    endpointId: z.string(),
  }),
  query: z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(25),
  }),
})

export const ListForwardsOutputSchema = z.object({
  items: z.array(ForwardLogSummarySchema),
  nextCursor: z.string().nullable(),
})

export type ForwardLog = z.infer<typeof ForwardLogSchema>
export type ForwardLogSummary = z.infer<typeof ForwardLogSummarySchema>
export type ListForwardsInput = z.infer<typeof ListForwardsInputSchema>
export type ListForwardsOutput = z.infer<typeof ListForwardsOutputSchema>
