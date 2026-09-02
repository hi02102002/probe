import { createId } from '@repo/utils'
import { DatabaseError } from '../errors/database.error.js'
import { endpoint } from '../postgres/schema.js'
import { withDb } from './with-db.js'

export type Endpoint = typeof endpoint.$inferSelect
export type NewEndpoint = typeof endpoint.$inferInsert

export interface CreateEndpointInput {
  id?: string
  name: string
  token?: string
  userId: string
}

export const createEndpoint = withDb(async (
  db,
  input: CreateEndpointInput,
) => {
  const [newEndpoint] = await db
    .insert(endpoint)
    .values({
      id: input.id,
      name: input.name,
      token: input.token ?? createId('ept', 32),
      userId: input.userId,
    })
    .returning({
      id: endpoint.id,
    })

  if (!newEndpoint) {
    throw new DatabaseError({
      entity: 'endpoint',
      operation: 'create',
    })
  }

  return newEndpoint
})
