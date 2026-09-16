import type { PostgresDatabase } from '../postgres/index.js'
import { and, desc, eq, ilike, lt, or } from 'drizzle-orm'
import { DatabaseError, NotFoundError } from '../errors/database.error.js'
import { escapeLike } from '../helpers/like.js'
import { withDb } from '../helpers/with-db.js'
import { endpoint, webhook_request } from '../postgres/schema.js'

type InsertRequestInput = typeof webhook_request.$inferInsert
type WebhookRequestMethod = InsertRequestInput['method']

export const insertRequest = withDb(async (db, request: InsertRequestInput) => {
  const [newRequest] = await db
    .insert(webhook_request)
    .values(request)
    .returning()

  if (!newRequest) {
    throw new DatabaseError({
      entity: 'webhook_request',
      operation: 'create',
      message: 'Failed to insert new webhook request',
    })
  }

  return newRequest
})

export interface GetRequestsInput {
  readonly endpointId: string
  readonly userId: string
  readonly cursor?: string
  readonly limit: number
  readonly method?: WebhookRequestMethod
  readonly query?: string
}

async function assertOwnedEndpoint(
  db: PostgresDatabase,
  endpointId: string,
  userId: string,
) {
  const ownedEndpoint = await db.query.endpoint.findFirst({
    where: {
      id: endpointId,
      userId,
    },
    columns: {
      id: true,
    },
  })

  if (!ownedEndpoint) {
    throw new NotFoundError({
      entity: 'endpoint',
      identifier: endpointId,
    })
  }
}

export const getRequests = withDb(async (db, input: GetRequestsInput) => {
  await assertOwnedEndpoint(db, input.endpointId, input.userId)

  const cursorRequest = input.cursor
    ? await db.query.webhook_request.findFirst({
        where: {
          endpointId: input.endpointId,
          id: input.cursor,
        },
        columns: {
          createdAt: true,
          id: true,
        },
      })
    : undefined

  if (input.cursor && !cursorRequest) {
    throw new NotFoundError({
      entity: 'webhook_request_cursor',
      identifier: input.cursor,
    })
  }

  const search = input.query ? `%${escapeLike(input.query)}%` : undefined
  const rows = await db
    .select({
      createdAt: webhook_request.createdAt,
      endpointId: webhook_request.endpointId,
      id: webhook_request.id,
      method: webhook_request.method,
      size: webhook_request.size,
      statusCode: webhook_request.statusCode,
      url: webhook_request.url,
    })
    .from(webhook_request)
    .innerJoin(endpoint, eq(endpoint.id, webhook_request.endpointId))
    .where(and(
      eq(webhook_request.endpointId, input.endpointId),
      eq(endpoint.userId, input.userId),
      input.method ? eq(webhook_request.method, input.method) : undefined,
      search
        ? or(
            ilike(webhook_request.id, search),
            ilike(webhook_request.url, search),
          )
        : undefined,
      cursorRequest
        ? or(
            lt(webhook_request.createdAt, cursorRequest.createdAt),
            and(
              eq(webhook_request.createdAt, cursorRequest.createdAt),
              lt(webhook_request.id, cursorRequest.id),
            ),
          )
        : undefined,
    ))
    .orderBy(desc(webhook_request.createdAt), desc(webhook_request.id))
    .limit(input.limit + 1)

  const hasNextPage = rows.length > input.limit
  const items = hasNextPage ? rows.slice(0, input.limit) : rows

  return {
    items,
    nextCursor: hasNextPage ? items.at(-1)?.id ?? null : null,
  }
})

export const getRequestById = withDb(async (db, input: {
  readonly endpointId: string
  readonly requestId: string
  readonly userId: string
}) => {
  await assertOwnedEndpoint(db, input.endpointId, input.userId)

  const request = await db.query.webhook_request.findFirst({
    where: {
      endpointId: input.endpointId,
      id: input.requestId,
    },
  })

  if (!request) {
    throw new NotFoundError({
      entity: 'webhook_request',
      identifier: input.requestId,
    })
  }

  return request
})
