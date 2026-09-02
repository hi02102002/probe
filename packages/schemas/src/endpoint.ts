import { z } from 'zod'

export const EndpointSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateEndpointInputSchema = z.object({
  name: z.string().trim().min(1, 'Endpoint name is required').max(50, 'Endpoint name must be 50 characters or less'),
})

export const CreateEndpointOutputSchema = z.object({
  id: z.string(),
})

export type Endpoint = z.infer<typeof EndpointSchema>
export type CreateEndpointInput = z.infer<typeof CreateEndpointInputSchema>
export type CreateEndpointOutput = z.infer<typeof CreateEndpointOutputSchema>
