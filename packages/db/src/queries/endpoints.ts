import { createId } from '@repo/utils'
import { and, desc, eq } from 'drizzle-orm'
import { DatabaseError, NotFoundError } from '../errors/database.error.js'
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
    .returning()

  if (!newEndpoint) {
    throw new DatabaseError({
      entity: 'endpoint',
      operation: 'create',
    })
  }

  return newEndpoint
})

export const getEndpointById = withDb(async (
  db,
  {
    endpointId,
    userId,
  }: {
    endpointId: string
    userId?: string
  },
) => {
  const [result] = userId
    ? await db
        .select()
        .from(endpoint)
        .where(and(eq(endpoint.id, endpointId), eq(endpoint.userId, userId)))
        .limit(1)
    : await db
        .select()
        .from(endpoint)
        .where(eq(endpoint.id, endpointId))
        .limit(1)

  if (!result) {
    throw new NotFoundError({
      entity: 'endpoint',
      identifier: endpointId,
    })
  }

  return result
})

export const getEndpointByToken = withDb(async (
  db,
  token: string,
) => {
  const [result] = await db
    .select()
    .from(endpoint)
    .where(eq(endpoint.token, token))
    .limit(1)

  if (!result) {
    throw new NotFoundError({
      entity: 'endpoint',
      identifier: token,
    })
  }

  return result
})

export const getEndpointsByUserId = withDb(async (
  db,
  userId: string,
) => {
  const endpoints = await db
    .select()
    .from(endpoint)
    .where(eq(endpoint.userId, userId))
    .orderBy(desc(endpoint.createdAt))

  return endpoints
})

export const deleteEndpoint = withDb(async (
  db,
  {
    endpointId,
    userId,
  }: {
    endpointId: string
    userId: string
  },
) => {
  const [deleted] = await db
    .delete(endpoint)
    .where(and(eq(endpoint.id, endpointId), eq(endpoint.userId, userId)))
    .returning()

  if (!deleted) {
    throw new NotFoundError({
      entity: 'endpoint',
      identifier: endpointId,
    })
  }

  return deleted
})
