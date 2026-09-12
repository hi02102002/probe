import type { ContractInputs, ContractOutputs, IngestEvent } from '@repo/api-contracts'
import type { ORPCContext } from '#/orpc/os.js'
import { getEndpointByToken, insertRequest } from '@repo/db'
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

    await context.publisher.publish(`ingest.${input.params.token}`, inserted.value)
    try {
      await context.publisher.publish(`ingest.${input.params.token}`, inserted.value)
    }
    catch (publishError) {
      console.error('[Publisher Error] Failed to publish event:', publishError)
    }

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
