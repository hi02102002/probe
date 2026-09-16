import { getRequestById, getRequests } from '@repo/db/queries/requests'
import { mapDatabaseError } from '#/orpc/errors/map-database-error.js'
import { authenticated, pub } from '#/orpc/os.js'

export const requestRouter = pub.request.router({
  list: authenticated.request.list.handler(async ({ context, input }) => {
    const result = await getRequests(context.db, {
      cursor: input.query.cursor,
      endpointId: input.params.endpointId,
      limit: input.query.limit,
      method: input.query.method,
      query: input.query.query,
      userId: context.user.id,
    })

    if (result.isErr()) {
      throw mapDatabaseError(result.error)
    }

    return result.value
  }),
  getById: authenticated.request.getById.handler(async ({ context, input }) => {
    const result = await getRequestById(context.db, {
      endpointId: input.params.endpointId,
      requestId: input.params.requestId,
      userId: context.user.id,
    })

    if (result.isErr()) {
      throw mapDatabaseError(result.error)
    }

    return result.value
  }),
})
