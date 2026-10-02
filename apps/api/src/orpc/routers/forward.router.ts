import { getForwardLogs } from '@repo/db/queries/forward-logs'
import { authenticated, pub } from '#/orpc/os.js'
import { mapDatabaseError } from '../errors/map-database-error.js'

export const forwardRouter = pub.forward.router({
  list: authenticated.forward.list.handler(async ({ context, input }) => {
    const result = await getForwardLogs(context.db, {
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
})
