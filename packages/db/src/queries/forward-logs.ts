import { and, desc, eq, lt, or } from 'drizzle-orm'
import { DatabaseError, NotFoundError } from '../errors/database.error.js'
import { withDb } from '../helpers/with-db.js'
import { endpoint, forward_log } from '../postgres/schema.js'
import { assertOwnedEndpoint } from './requests.js'

type InsertForwardLogInput = typeof forward_log.$inferInsert

export const insertForwardLog = withDb(async (db, log: InsertForwardLogInput) => {
  const [newLog] = await db
    .insert(forward_log)
    .values(log)
    .returning()

  if (!newLog) {
    throw new DatabaseError({
      entity: 'forward_log',
      operation: 'create',
      message: 'Failed to insert forward log',
    })
  }

  return newLog
})

export interface GetForwardLogsInput {
  readonly endpointId: string
  readonly userId: string
  readonly cursor?: string
  readonly limit: number
}

export const getForwardLogs = withDb(async (db, input: GetForwardLogsInput) => {
  await assertOwnedEndpoint(db, input.endpointId, input.userId)

  const cursorLog = input.cursor
    ? await db.query.forward_log.findFirst({
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

  if (input.cursor && !cursorLog) {
    throw new NotFoundError({
      entity: 'forward_log_cursor',
      identifier: input.cursor,
    })
  }

  const rows = await db
    .select({
      createdAt: forward_log.createdAt,
      durationMs: forward_log.durationMs,
      endpointId: forward_log.endpointId,
      id: forward_log.id,
      method: forward_log.method,
      statusCode: forward_log.statusCode,
      success: forward_log.success,
      targetUrl: forward_log.targetUrl,
    })
    .from(forward_log)
    .innerJoin(endpoint, eq(endpoint.id, forward_log.endpointId))
    .where(and(
      eq(forward_log.endpointId, input.endpointId),
      eq(endpoint.userId, input.userId),
      cursorLog
        ? or(
            lt(forward_log.createdAt, cursorLog.createdAt),
            and(
              eq(forward_log.createdAt, cursorLog.createdAt),
              lt(forward_log.id, cursorLog.id),
            ),
          )
        : undefined,
    ))
    .orderBy(desc(forward_log.createdAt), desc(forward_log.id))
    .limit(input.limit + 1)

  const hasNextPage = rows.length > input.limit
  const items = hasNextPage ? rows.slice(0, input.limit) : rows

  return {
    items,
    nextCursor: hasNextPage ? items.at(-1)?.id ?? null : null,
  }
})
