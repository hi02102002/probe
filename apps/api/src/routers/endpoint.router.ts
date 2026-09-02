import { createEndpoint } from '@repo/db/queries/endpoints'
import { mapDatabaseError } from '#/libs/orpc/errors/map-database-error.js'
import { authenticated, pub } from '#/libs/orpc/os.js'

export const endpointRouter = pub.endpoint.router({
  createEndpoint: authenticated.endpoint.createEndpoint.handler(async ({ context, input }) => {
    const result = await createEndpoint(context.db, {
      name: input.body.name,
      userId: context.user.id,
    })

    if (result.isErr()) {
      throw mapDatabaseError(result.error)
    }

    return {
      id: result.value.id,
    }
  }),
})
