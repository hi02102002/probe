import { oc } from '@orpc/contract'
import { CreateEndpointInputSchema, CreateEndpointOutputSchema } from '@repo/schemas/endpoint'
import { z } from 'zod'

const tags = ['Endpoints'] as const

export const endpointContract = {
  createEndpoint: oc
    .route({
      description: 'Create a new endpoint for receiving webhooks',
      method: 'POST',
      path: '/endpoints',
      summary: 'Create endpoint',
      tags,
    })
    .input(z.object({
      body: CreateEndpointInputSchema,
    }))
    .output(CreateEndpointOutputSchema),
}
