import { createId } from '@repo/utils'
import { and, count, desc, eq, ilike } from 'drizzle-orm'
import { DatabaseError, NotFoundError } from '../errors/database.error.js'
import { createPaginatedResult, resolvePagination } from '../helpers/pagination.js'
import { mapSort } from '../helpers/sort.js'
import { withDb } from '../helpers/with-db.js'
import { endpoint } from '../postgres/schema.js'

export interface CreateEndpointInput {
  id?: string
  name: string
  token?: string
  userId: string
}

export interface GetAllEndpointsInput {
  userId: string
  status?: 'active' | 'inactive' | 'paused'
  query?: string
  sort?: {
    by: 'name' | 'createdAt' | 'lastRequestAt'
    order: 'asc' | 'desc'
  }
  pagination?: {
    page?: number
    limit?: number
  }
}

export const createEndpoint = withDb(async (
  db,
  input: CreateEndpointInput,
) => {
  const [newEndpoint] = await db
    .insert(endpoint)
    .values({
      id: input.id ?? createId('ept', 32),
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

export const getAllEndpoints = withDb(async (db, input: GetAllEndpointsInput) => {
  const baseOrder = mapSort(input.sort, {
    createdAt: endpoint.createdAt,
    lastRequestAt: endpoint.lastRequestAt,
    name: endpoint.name,
  }, [desc(endpoint.createdAt)])

  const orderBy = [
    ...baseOrder,
    ...(input.sort?.by && input.sort.by !== 'createdAt' ? [desc(endpoint.createdAt)] : []),
    desc(endpoint.id),
  ]

  const { limit, offset, page } = resolvePagination(input.pagination, {
    defaultLimit: 10,
    maxLimit: 100,
  })

  const whereClause = and(
    eq(endpoint.userId, input.userId),
    input.status ? eq(endpoint.status, input.status) : undefined,
    input.query ? ilike(endpoint.name, `%${input.query}%`) : undefined,
  )

  const [
    items,
    countResult,
  ] = await Promise.all([
    db.select().from(endpoint).where(
      whereClause,
    ).orderBy(...orderBy).limit(limit).offset(offset),
    db.select({
      count: count(),
    }).from(endpoint).where(
      whereClause,
    ),
  ])

  return createPaginatedResult(items, {
    totalCount: countResult[0]?.count ?? 0,
    page,
    limit,
  })
})

export const deleteEndpoint = withDb(async (db, { id, userId }: {
  id: string
  userId: string
}) => {
  const existingEndpoint = await db.query.endpoint.findFirst({
    where: {
      id,
      userId,
    },
    columns: {
      id: true,
    },
  })

  if (!existingEndpoint) {
    throw new NotFoundError({
      entity: 'endpoint',
      message: `Endpoint with id ${id} not found for user ${userId}`,
    })
  }

  const deleted = await db.delete(endpoint).where(eq(endpoint.id, id)).returning({
    id: endpoint.id,
  })

  const deletedEndpoint = deleted[0]

  if (!deletedEndpoint) {
    throw new DatabaseError({
      entity: 'endpoint',
      operation: 'delete',
      message: `Failed to delete endpoint with id ${id} for user ${userId}`,
    })
  }

  return deletedEndpoint
})

export const updateEndpoint = withDb(async (
  db,
  endpointId: string,
  userId: string,
  data: {
    name?: string
    status?: 'active' | 'inactive' | 'paused'
  },
) => {
  const existingEndpoint = await db.query.endpoint.findFirst({
    where: {
      id: endpointId,
      userId,
    },
    columns: {
      id: true,
    },
  })

  if (!existingEndpoint) {
    throw new NotFoundError({
      entity: 'endpoint',
      message: `Endpoint with id ${endpointId} not found for user ${userId}`,
    })
  }

  const updated = await db
    .update(endpoint)
    .set(data)
    .where(and(
      eq(endpoint.id, endpointId),
      eq(endpoint.userId, userId),
    ))
    .returning({
      id: endpoint.id,
    })

  const updatedEndpoint = updated[0]

  if (!updatedEndpoint) {
    throw new DatabaseError({
      entity: 'endpoint',
      operation: 'update',
      message: `Failed to update endpoint with id ${endpointId} for user ${userId}`,
    })
  }

  return updatedEndpoint
})
