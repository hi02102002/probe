import { z } from 'zod'

export const WebhookRequestMethodSchema = z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])

export const WebhookRequest = z.object({
  id: z.string().describe('Unique webhook request ID'),
  endpointId: z.string().describe('Associated endpoint ID'),
  method: WebhookRequestMethodSchema.describe('HTTP method'),
  url: z.string().describe('Request URL'),
  reqHeaders: z.unknown().describe('Captured request headers'),
  reqBody: z.unknown().nullable().optional().describe('Captured request body'),
  resHeaders: z.unknown().nullable().optional().describe('Response headers'),
  resBody: z.unknown().nullable().optional().describe('Response body'),
  statusCode: z.string().nullable().optional().describe('Response status code'),
  ip: z.string().nullable().optional().describe('Client IP address'),
  size: z.string().nullable().optional().describe('Request payload size'),
  createdAt: z.date().describe('Creation timestamp'),
  updatedAt: z.date().describe('Last updated timestamp'),
})

export const WebhookRequestSummarySchema = WebhookRequest.pick({
  id: true,
  endpointId: true,
  method: true,
  url: true,
  statusCode: true,
  size: true,
  createdAt: true,
})

export type WebhookRequestMethod = z.infer<typeof WebhookRequestMethodSchema>
export type WebhookRequestSummary = z.infer<typeof WebhookRequestSummarySchema>
