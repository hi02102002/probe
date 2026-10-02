import { ORPCError } from '@orpc/server'
import { getRuleByEndpointId, upsertEndpointRule } from '@repo/db/queries/rules'
import { assertPublicHttpUrl, UnsafeTargetError } from '#/libs/ssrf.js'
import { authenticated, pub } from '#/orpc/os.js'
import { mapDatabaseError } from '../errors/map-database-error.js'

export const ruleRouter = pub.rule.router({
  get: authenticated.rule.get.handler(async ({ context, input }) => {
    const result = await getRuleByEndpointId(context.db, {
      endpointId: input.params.endpointId,
      userId: context.user.id,
    })

    if (result.isErr()) {
      throw mapDatabaseError(result.error)
    }

    return { rule: result.value }
  }),
  save: authenticated.rule.save.handler(async ({ context, input }) => {
    if (input.body.forwarding.enabled) {
      try {
        await assertPublicHttpUrl(input.body.forwarding.targetUrl)
      }
      catch (error) {
        if (error instanceof UnsafeTargetError) {
          throw new ORPCError('BAD_REQUEST', {
            message: error.message,
          })
        }

        throw error
      }
    }

    const result = await upsertEndpointRule(context.db, {
      customContentType: input.body.customResponse.contentType,
      customResponseEnabled: input.body.customResponse.enabled,
      customResponseBody: input.body.customResponse.body,
      customStatusCode: input.body.customResponse.statusCode,
      delayEnabled: input.body.delay.enabled,
      delayMs: input.body.delay.durationMs,
      endpointId: input.params.endpointId,
      forwardEnabled: input.body.forwarding.enabled,
      forwardTargetUrl: input.body.forwarding.targetUrl,
      signatureEnabled: input.body.signature.enabled,
      signatureHeaderName: input.body.signature.headerName,
      signatureSecret: input.body.signature.secret,
      userId: context.user.id,
    })

    if (result.isErr()) {
      throw mapDatabaseError(result.error)
    }

    return { rule: result.value }
  }),
})
