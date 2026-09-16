import { eventIterator, oc } from '@orpc/contract'
import { WebhookRequest } from '@repo/schemas'
import { z } from 'zod'

const tags = ['Webhook Ingestion'] as const

const IngestTokenParamSchema = z.object({
  token: z.string().describe('Unique endpoint token'),
})

export const IngestPayloadInputSchema = z.object({
  params: IngestTokenParamSchema,
  query: z.record(z.string(), z.any()).optional().describe('Query parameters'),
  body: z.unknown().optional().describe('Webhook payload (JSON or any structure)'),
})

export const IngestNoBodyInputSchema = z.object({
  params: IngestTokenParamSchema,
  query: z.record(z.string(), z.any()).optional().describe('Query parameters'),
})

export const ingestContract = {
  post: oc
    .route({
      description: 'Ingest POST webhook payload',
      inputStructure: 'detailed',
      method: 'POST',
      path: '/e/{token}',
      summary: 'Ingest POST webhook',
      tags,
    })
    .input(IngestPayloadInputSchema)
    .output(z.object({
      success: z.boolean().describe('Whether the webhook was received successfully'),
    })),

  get: oc
    .route({
      description: 'Ingest GET webhook (verification pings / challenge checks)',
      inputStructure: 'detailed',
      method: 'GET',
      path: '/e/{token}',
      summary: 'Ingest GET webhook',
      tags,
    })
    .input(IngestNoBodyInputSchema)
    .output(z.object({
      success: z.boolean().describe('Whether the webhook was received successfully'),
    })),

  put: oc
    .route({
      description: 'Ingest PUT webhook payload',
      inputStructure: 'detailed',
      method: 'PUT',
      path: '/e/{token}',
      summary: 'Ingest PUT webhook',
      tags,
    })
    .input(IngestPayloadInputSchema)
    .output(z.object({
      success: z.boolean().describe('Whether the webhook was received successfully'),
    })),

  patch: oc
    .route({
      description: 'Ingest PATCH webhook payload',
      inputStructure: 'detailed',
      method: 'PATCH',
      path: '/e/{token}',
      summary: 'Ingest PATCH webhook',
      tags,
    })
    .input(IngestPayloadInputSchema)
    .output(z.object({
      success: z.boolean().describe('Whether the webhook was received successfully'),
    })),

  delete: oc
    .route({
      description: 'Ingest DELETE webhook request',
      inputStructure: 'detailed',
      method: 'DELETE',
      path: '/e/{token}',
      summary: 'Ingest DELETE webhook',
      tags,
    })
    .input(IngestNoBodyInputSchema)
    .output(z.object({
      success: z.boolean().describe('Whether the webhook was received successfully'),
    })),
  stream: oc
    .route({
      description: 'Stream incoming webhooks in real-time via Server-Sent Events (SSE)',
      inputStructure: 'detailed',
      method: 'GET',
      path: '/e/{token}/stream',
      summary: 'Stream webhook events (SSE)',
      tags,
    })
    .input(IngestNoBodyInputSchema)
    .output(eventIterator(WebhookRequest.describe('Webhook request event stream'))),
}

export type IngestEvent = z.infer<typeof WebhookRequest>
