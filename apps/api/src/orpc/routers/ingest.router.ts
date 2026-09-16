import type { ContractInputs, ContractOutputs, IngestEvent } from '@repo/api-contracts'
import type { ORPCContext } from '#/orpc/os.js'
import { ORPCError } from '@orpc/server'
import { drizzle, getEndpointByToken, insertRequest } from '@repo/db'
import { endpoint as sEndpoint } from '@repo/db/schema'
import { getClientIp, toStandardHeaders } from '@repo/utils'
import { pub } from '#/orpc/os.js'
import { mapDatabaseError } from '../errors/map-database-error.js'

type IngestInput = ContractInputs['ingest']['post'] | ContractInputs['ingest']['get']
type IngestOutput = ContractOutputs['ingest']['post']

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

function createIngestHandler(method: Method) {
  return async ({ context, input }: {
    context: ORPCContext
    input: IngestInput
  }): Promise<IngestOutput> => {
    const headers = toStandardHeaders(context.reqHeaders ?? {})
    const ip = getClientIp(context.reqHeaders ?? {})

    const endpoint = await getEndpointByToken(context.db, input.params.token)

    if (endpoint.isErr()) {
      throw mapDatabaseError(endpoint.error)
    }

    if (endpoint.value.status === 'paused') {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Endpoint is paused and cannot accept requests',
      })
    }

    if (endpoint.value.status === 'inactive') {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Endpoint is inactive and cannot accept requests',
      })
    }

    const inserted = await insertRequest(context.db, {
      endpointId: endpoint.value.id,
      ip,
      method,
      reqBody: 'body' in input ? input.body : null,
      reqHeaders: headers,
      url: context.request?.url ?? `/api/e/${input.params.token}`,
    })

    if (inserted.isErr()) {
      throw mapDatabaseError(inserted.error)
    }

    try {
      await context.publisher.publish(`ingest.${input.params.token}`, inserted.value)
    }
    catch (publishError) {
      context.log.error('Failed to publish ingest event', {
        error: publishError,
        endpointId: endpoint.value.id,
        requestId: inserted.value.id,
      })
    }

    await context.db.update(sEndpoint).set({
      lastRequestAt: new Date(),
    }).where(drizzle.eq(sEndpoint.id, endpoint.value.id)).catch(void 0)

    return {
      success: true,
    }
  }
}

export const ingestRouter = pub.ingest.router({
  delete: pub.ingest.delete.handler(createIngestHandler('DELETE')),
  get: pub.ingest.get.handler(createIngestHandler('GET')),
  patch: pub.ingest.patch.handler(createIngestHandler('PATCH')),
  post: pub.ingest.post.handler(createIngestHandler('POST')),
  put: pub.ingest.put.handler(createIngestHandler('PUT')),
  stream: pub.ingest.stream.handler(async function* ({ context, input, signal }) {
    const endpoint = await getEndpointByToken(context.db, input.params.token)

    if (endpoint.isErr()) {
      throw mapDatabaseError(endpoint.error)
    }

    const iterator = context.publisher.subscribe(`ingest.${input.params.token}`, { signal })

    for await (const event of iterator) {
      yield event as IngestEvent
    }
  }),

})
