import { ORPCError } from '@orpc/server'
import { getReplayLogs, insertReplayLog } from '@repo/db/queries/replays'
import { assertOwnedEndpoint } from '@repo/db/queries/requests'
import { readCappedText } from '#/libs/capped-text.js'
import { safeFetch } from '#/libs/safe-fetch.js'
import { assertPublicHttpUrl, UnsafeTargetError } from '#/libs/ssrf.js'
import { authenticated, pub } from '#/orpc/os.js'
import { mapDatabaseError } from '../errors/map-database-error.js'

const REPLAY_TIMEOUT_MS = 10_000
const MAX_STORED_RESPONSE_CHARS = 20_000

export const replayRouter = pub.replay.router({
  list: authenticated.replay.list.handler(async ({ context, input }) => {
    const result = await getReplayLogs(context.db, {
      cursor: input.query.cursor,
      endpointId: input.params.endpointId,
      limit: input.query.limit,
      userId: context.user.id,
    })

    if (result.isErr()) {
      throw mapDatabaseError(result.error)
    }

    return result.value
  }),
  send: authenticated.replay.send.handler(async ({ context, input }) => {
    try {
      await assertOwnedEndpoint(context.db, input.params.endpointId, context.user.id)
    }
    catch (error) {
      throw mapDatabaseError(error)
    }

    try {
      await assertPublicHttpUrl(input.body.url)
    }
    catch (error) {
      if (error instanceof UnsafeTargetError) {
        throw new ORPCError('BAD_REQUEST', {
          message: error.message,
        })
      }

      throw error
    }

    const payload = input.body.payload ?? null
    const hasJsonPayload = payload !== null
      && input.body.method !== 'GET'
      && (() => {
        try {
          JSON.parse(payload)
          return true
        }
        catch {
          return false
        }
      })()

    const startedAt = Date.now()

    let log: Parameters<typeof insertReplayLog>[1]

    try {
      const response = await safeFetch(input.body.url, {
        body: input.body.method === 'GET' ? undefined : payload ?? undefined,
        headers: hasJsonPayload
          ? { 'content-type': 'application/json' }
          : undefined,
        method: input.body.method,
        signal: AbortSignal.timeout(REPLAY_TIMEOUT_MS),
      })
      const durationMs = Date.now() - startedAt
      const responseBody = await readCappedText(response, MAX_STORED_RESPONSE_CHARS)

      log = {
        durationMs,
        endpointId: input.params.endpointId,
        error: null,
        method: input.body.method,
        originalRequestId: input.body.requestId ?? null,
        reqBody: payload,
        resBody: responseBody,
        statusCode: response.status,
        success: response.ok,
        targetUrl: input.body.url,
      }
    }
    catch (fetchError) {
      const durationMs = Date.now() - startedAt
      const message = fetchError instanceof Error
        ? `${fetchError.name}: ${fetchError.message}`
        : 'Replay request failed'

      log = {
        durationMs,
        endpointId: input.params.endpointId,
        error: message,
        method: input.body.method,
        originalRequestId: input.body.requestId ?? null,
        reqBody: payload,
        resBody: null,
        statusCode: null,
        success: false,
        targetUrl: input.body.url,
      }
    }

    const inserted = await insertReplayLog(context.db, log)

    if (inserted.isErr()) {
      throw mapDatabaseError(inserted.error)
    }

    return { log: inserted.value }
  }),
})
