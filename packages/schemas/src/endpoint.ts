import { z } from 'zod'
import { createPaginatedOutputSchema, PaginationInputSchema } from './pagination.js'

export const EndpointSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastRequestAt: z.date().nullable(),
  status: z.enum(['active', 'inactive', 'paused']),
})

export const CreateEndpointInputSchema = z.object({
  name: z.string().trim().min(1, 'Endpoint name is required').max(50, 'Endpoint name must be 50 characters or less'),
})

export const CreateEndpointOutputSchema = z.object({
  id: z.string(),
})

export const GetAllEndpointsInputSchema = z.object({
  status: z.enum(['active', 'inactive', 'paused']).optional(),
  query: z.string().optional(),
  sort: z.object({
    by: z.enum(['name', 'createdAt', 'lastRequestAt']),
    order: z.enum(['asc', 'desc']),
  }).optional(),
  pagination: PaginationInputSchema.optional(),
})

export const GetAllEndpointsOutputSchema = createPaginatedOutputSchema(EndpointSchema)

export type Endpoint = z.infer<typeof EndpointSchema>
export type CreateEndpointInput = z.infer<typeof CreateEndpointInputSchema>
export type CreateEndpointOutput = z.infer<typeof CreateEndpointOutputSchema>
export type GetAllEndpointsInput = z.infer<typeof GetAllEndpointsInputSchema>
export type GetAllEndpointsOutput = z.infer<typeof GetAllEndpointsOutputSchema>
