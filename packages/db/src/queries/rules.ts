import { DatabaseError } from '../errors/database.error.js'
import { withDb } from '../helpers/with-db.js'
import { endpoint_rule } from '../postgres/schema.js'
import { assertOwnedEndpoint } from './requests.js'

type InsertEndpointRuleInput = typeof endpoint_rule.$inferInsert

export const getRuleByEndpointId = withDb(async (db, input: {
  readonly endpointId: string
  readonly userId: string
}) => {
  await assertOwnedEndpoint(db, input.endpointId, input.userId)

  return await db.query.endpoint_rule.findFirst({
    where: {
      endpointId: input.endpointId,
    },
  }) ?? null
})

export const upsertEndpointRule = withDb(async (db, input: InsertEndpointRuleInput & {
  readonly userId: string
}) => {
  await assertOwnedEndpoint(db, input.endpointId, input.userId)

  const [rule] = await db
    .insert(endpoint_rule)
    .values({
      customContentType: input.customContentType,
      customResponseEnabled: input.customResponseEnabled,
      customResponseBody: input.customResponseBody,
      customStatusCode: input.customStatusCode,
      delayEnabled: input.delayEnabled,
      delayMs: input.delayMs,
      endpointId: input.endpointId,
      forwardEnabled: input.forwardEnabled,
      forwardTargetUrl: input.forwardTargetUrl,
      signatureEnabled: input.signatureEnabled,
      signatureHeaderName: input.signatureHeaderName,
      signatureSecret: input.signatureSecret,
    })
    .onConflictDoUpdate({
      set: {
        customContentType: input.customContentType,
        customResponseEnabled: input.customResponseEnabled,
        customResponseBody: input.customResponseBody,
        customStatusCode: input.customStatusCode,
        delayEnabled: input.delayEnabled,
        delayMs: input.delayMs,
        forwardEnabled: input.forwardEnabled,
        forwardTargetUrl: input.forwardTargetUrl,
        signatureEnabled: input.signatureEnabled,
        signatureHeaderName: input.signatureHeaderName,
        signatureSecret: input.signatureSecret,
      },
      target: endpoint_rule.endpointId,
    })
    .returning()

  if (!rule) {
    throw new DatabaseError({
      entity: 'endpoint_rule',
      operation: 'update',
      message: 'Failed to upsert endpoint rule',
    })
  }

  return rule
})
