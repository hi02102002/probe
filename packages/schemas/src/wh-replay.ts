import { z } from 'zod'
import { WebhookRequestMethodSchema } from './wh-request.js'

export const ReplayLogSchema = z.object({
  id: z.string().describe('Unique replay log ID'),
  endpointId: z.string().describe('Associated endpoint ID'),
  originalRequestId: z.string().nullable().optional().describe('Captured request that was replayed'),
  method: WebhookRequestMethodSchema.describe('HTTP method used for the replay'),
  targetUrl: z.string().describe('Destination URL the replay was sent to'),
  reqBody: z.unknown().nullable().optional().describe('Payload sent to the destination'),
  statusCode: z.number().int().nullable().optional().describe('Destination response status code'),
  resBody: z.unknown().nullable().optional().describe('Destination response body (truncated)'),
  durationMs: z.number().int().nullable().optional().describe('Round-trip duration in milliseconds'),
  success: z.boolean().describe('Whether the destination returned a 2xx response'),
  error: z.string().nullable().optional().describe('Network error message when the replay failed'),
  createdAt: z.date().describe('Creation timestamp'),
  updatedAt: z.date().describe('Last updated timestamp'),
})

export const ReplayLogSummarySchema = ReplayLogSchema.pick({
  createdAt: true,
  durationMs: true,
  id: true,
  method: true,
  originalRequestId: true,
  statusCode: true,
  success: true,
  targetUrl: true,
})

export const SendReplayInputSchema = z.object({
  params: z.object({
    endpointId: z.string(),
  }),
  body: z.object({
    method: WebhookRequestMethodSchema.default('POST'),
    payload: z.string().max(200_000).optional().describe('Raw request body to send'),
    requestId: z.string().optional().describe('Captured request the payload originates from'),
    url: z.url().describe('Destination URL, must resolve to a public address'),
  }),
})

export const SendReplayOutputSchema = z.object({
  log: ReplayLogSchema,
})

export const ListReplaysInputSchema = z.object({
  params: z.object({
    endpointId: z.string(),
  }),
  query: z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(25),
  }),
})

export const ListReplaysOutputSchema = z.object({
  items: z.array(ReplayLogSummarySchema),
  nextCursor: z.string().nullable(),
})

export type ReplayLog = z.infer<typeof ReplayLogSchema>
export type ReplayLogSummary = z.infer<typeof ReplayLogSummarySchema>
export type SendReplayInput = z.infer<typeof SendReplayInputSchema>
export type SendReplayOutput = z.infer<typeof SendReplayOutputSchema>
export type ListReplaysInput = z.infer<typeof ListReplaysInputSchema>
export type ListReplaysOutput = z.infer<typeof ListReplaysOutputSchema>
