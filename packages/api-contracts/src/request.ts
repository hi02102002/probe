import { oc } from '@orpc/contract'
import {
  WebhookRequest,
  WebhookRequestMethodSchema,
  WebhookRequestSummarySchema,
} from '@repo/schemas/wh-request'
import { z } from 'zod'

const tags = ['Webhook Requests'] as const

const EndpointRequestParamsSchema = z.object({
  endpointId: z.string(),
})

export const ListRequestsInputSchema = z.object({
  params: EndpointRequestParamsSchema,
  query: z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(25),
    method: WebhookRequestMethodSchema.optional(),
    query: z.string().trim().max(200).optional(),
  }),
})

export const ListRequestsOutputSchema = z.object({
  items: z.array(WebhookRequestSummarySchema),
  nextCursor: z.string().nullable(),
})

export const requestContract = {
  list: oc
    .route({
      description: 'List captured webhook requests for an owned endpoint',
      inputStructure: 'detailed',
      method: 'GET',
      path: '/endpoints/{endpointId}/requests',
      summary: 'List captured webhook requests',
      tags,
    })
    .input(ListRequestsInputSchema)
    .output(ListRequestsOutputSchema),
  getById: oc
    .route({
      description: 'Get a captured webhook request for an owned endpoint',
      inputStructure: 'detailed',
      method: 'GET',
      path: '/endpoints/{endpointId}/requests/{requestId}',
      summary: 'Get captured webhook request',
      tags,
    })
    .input(z.object({
      params: EndpointRequestParamsSchema.extend({
        requestId: z.string(),
      }),
    }))
    .output(WebhookRequest),
}
