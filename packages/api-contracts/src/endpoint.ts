import { oc } from '@orpc/contract'
import { CreateEndpointInputSchema, CreateEndpointOutputSchema, GetAllEndpointsInputSchema, GetAllEndpointsOutputSchema } from '@repo/schemas/endpoint'
import { z } from 'zod'

const tags = ['Endpoints'] as const

export const endpointContract = {
  create: oc
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
  list: oc
    .route({
      method: 'GET',
      path: '/endpoints',
      summary: 'List endpoints with pagination',
      tags: ['Endpoints'],
    })
    .input(z.object({
      query: GetAllEndpointsInputSchema,
    }))
    .output(GetAllEndpointsOutputSchema),
}
