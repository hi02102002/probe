import { DatabaseError } from '../errors/database.error.js'
import { withDb } from '../helpers/with-db.js'
import { webhook_request } from '../postgres/schema.js'

type InsertRequestInput = typeof webhook_request.$inferInsert

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
