import { z } from 'zod'

/**
 * Standard input schema for pagination in API / oRPC queries.
 * Uses `z.coerce` to seamlessly handle query strings in GET requests (e.g. ?page=1&limit=10).
 */
export const PaginationInputSchema = z.object({
  page: z.coerce
    .number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1)
    .optional(),
  limit: z.coerce
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10)
    .optional(),
})

export const PaginationQuerySchema = PaginationInputSchema

/**
 * Standard pagination metadata returned in API responses.
 */
export const PaginationMetaSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  totalCount: z.number().int().min(0),
  totalPages: z.number().int().min(1),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
})

/**
 * Helper to generate a standardized paginated response schema for any item schema.
 *
 * @example
 * ```ts
 * const ListEndpointsOutputSchema = createPaginatedOutputSchema(EndpointSchema)
 * ```
 */
export function createPaginatedOutputSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    pagination: PaginationMetaSchema,
  })
}

export type PaginationInput = z.infer<typeof PaginationInputSchema>
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
export interface PaginatedOutput<T> {
  items: T[]
  pagination: PaginationMeta
}
