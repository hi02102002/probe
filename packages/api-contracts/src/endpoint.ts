import { oc } from '@orpc/contract'
import { CreateEndpointInputSchema, CreateEndpointOutputSchema, EndpointSchema, GetAllEndpointsInputSchema, GetAllEndpointsOutputSchema } from '@repo/schemas/endpoint'
import { z } from 'zod'

const tags = ['Endpoints'] as const

export const endpointContract = {
  create: oc
    .route({
      description: 'Create a new endpoint for receiving webhooks',
      inputStructure: 'detailed',
      method: 'POST',
      path: '/endpoints',
      summary: 'Create endpoint',
      tags,
    })
    .input(z.object({
      body: CreateEndpointInputSchema,
    }))
    .output(CreateEndpointOutputSchema),
  delete: oc
    .route({
      description: 'Delete an endpoint and its captured webhook requests',
      inputStructure: 'detailed',
      method: 'DELETE',
      path: '/endpoints/{id}',
      summary: 'Delete endpoint',
      tags,
    })
    .input(z.object({
      params: EndpointSchema.pick({ id: true }),
    }))
    .output(EndpointSchema.pick({ id: true })),
  list: oc
    .route({
      inputStructure: 'detailed',
      method: 'GET',
      path: '/endpoints',
      summary: 'List endpoints with pagination',
      tags,
    })
    .input(z.object({
      query: GetAllEndpointsInputSchema,
    }))
    .output(GetAllEndpointsOutputSchema),
  getById: oc
    .route({
      description: 'Get a single endpoint by its ID',
      inputStructure: 'detailed',
      method: 'GET',
      path: '/endpoints/{id}',
      summary: 'Get endpoint by ID',
      tags,
    })
    .input(z.object({
      params: EndpointSchema.pick({ id: true }),
    }))
    .output(EndpointSchema),
  update: oc
    .route({
      description: 'Update an endpoint owned by the authenticated user',
      inputStructure: 'detailed',
      method: 'PATCH',
      path: '/endpoints/{id}',
      summary: 'Update endpoint',
      tags,
    })
    .input(z.object({
      params: EndpointSchema.pick({ id: true }),
      body: CreateEndpointInputSchema.extend({
        status: EndpointSchema.shape.status,
      }).partial().refine(
        value => value.name !== undefined || value.status !== undefined,
        { message: 'At least one field is required' },
      ),
    }))
    .output(EndpointSchema.pick({ id: true })),
  changeStatus: oc
    .route({
      description: 'Change the status of an endpoint owned by the authenticated user',
      inputStructure: 'detailed',
      method: 'PATCH',
      path: '/endpoints/{id}/status',
      summary: 'Change endpoint status',
      tags,
    })
    .input(z.object({
      params: EndpointSchema.pick({ id: true }),
      body: z.object({
        status: EndpointSchema.shape.status,
      }),
    }))
    .output(EndpointSchema.pick({ id: true })),
}
