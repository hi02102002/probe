import { and, desc, eq, lt, or } from 'drizzle-orm'
import { DatabaseError, NotFoundError } from '../errors/database.error.js'
import { withDb } from '../helpers/with-db.js'
import { endpoint, replay_log } from '../postgres/schema.js'
import { assertOwnedEndpoint } from './requests.js'

type InsertReplayLogInput = typeof replay_log.$inferInsert

export const insertReplayLog = withDb(async (db, log: InsertReplayLogInput) => {
  const [newLog] = await db
    .insert(replay_log)
    .values(log)
    .returning()

  if (!newLog) {
    throw new DatabaseError({
      entity: 'replay_log',
      operation: 'create',
      message: 'Failed to insert replay log',
    })
  }

  return newLog
})

export interface GetReplayLogsInput {
  readonly endpointId: string
  readonly userId: string
  readonly cursor?: string
  readonly limit: number
}

export const getReplayLogs = withDb(async (db, input: GetReplayLogsInput) => {
  await assertOwnedEndpoint(db, input.endpointId, input.userId)

  const cursorLog = input.cursor
    ? await db.query.replay_log.findFirst({
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
      entity: 'replay_log_cursor',
      identifier: input.cursor,
    })
  }

  const rows = await db
    .select({
      createdAt: replay_log.createdAt,
      durationMs: replay_log.durationMs,
      endpointId: replay_log.endpointId,
      id: replay_log.id,
      method: replay_log.method,
      originalRequestId: replay_log.originalRequestId,
      statusCode: replay_log.statusCode,
      success: replay_log.success,
      targetUrl: replay_log.targetUrl,
    })
    .from(replay_log)
    .innerJoin(endpoint, eq(endpoint.id, replay_log.endpointId))
    .where(and(
      eq(replay_log.endpointId, input.endpointId),
      eq(endpoint.userId, input.userId),
      cursorLog
        ? or(
            lt(replay_log.createdAt, cursorLog.createdAt),
            and(
              eq(replay_log.createdAt, cursorLog.createdAt),
              lt(replay_log.id, cursorLog.id),
            ),
          )
        : undefined,
    ))
    .orderBy(desc(replay_log.createdAt), desc(replay_log.id))
    .limit(input.limit + 1)

  const hasNextPage = rows.length > input.limit
  const items = hasNextPage ? rows.slice(0, input.limit) : rows

  return {
    items,
    nextCursor: hasNextPage ? items.at(-1)?.id ?? null : null,
  }
})
