import { createId } from '@repo/utils'
import { and, asc, count, eq, ilike } from 'drizzle-orm'
import { DatabaseError } from '../errors/database.error.js'
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
    page: number
    limit: number
  }
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

export const getAllEndpoints = withDb(async (db, input: GetAllEndpointsInput) => {
  const orderBy = mapSort(input.sort, {
    createdAt: endpoint.createdAt,
    lastRequestAt: endpoint.updatedAt,
    name: endpoint.name,
  }, [asc(endpoint.name)])

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
