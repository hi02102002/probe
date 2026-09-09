import { createEndpoint, deleteEndpoint, getAllEndpoints, getEndpointById, updateEndpoint } from '@repo/db/queries/endpoints'
import { mapDatabaseError } from '#/libs/orpc/errors/map-database-error.js'
import { authenticated, pub } from '#/libs/orpc/os.js'

export const endpointRouter = pub.endpoint.router({
  create: authenticated.endpoint.create.handler(async ({ context, input }) => {
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
  delete: authenticated.endpoint.delete.handler(async ({ context, input }) => {
    const result = await deleteEndpoint(context.db, {
      id: input.params.id,
      userId: context.user.id,
    })

    if (result.isErr()) {
      throw mapDatabaseError(result.error)
    }

    return {
      id: result.value.id,
    }
  }),
  list: authenticated.endpoint.list.handler(async ({ context, input }) => {
    const result = await getAllEndpoints(context.db, {
      userId: context.user.id,
      status: input.query.status,
      query: input.query.query,
      sort: input.query.sort,
      pagination: input.query.pagination,
    })

    if (result.isErr()) {
      throw mapDatabaseError(result.error)
    }

    return result.value
  }),
  update: authenticated.endpoint.update.handler(async ({ context, input }) => {
    const result = await updateEndpoint(
      context.db,
      input.params.id,
      context.user.id,
      input.body,
    )

    if (result.isErr()) {
      throw mapDatabaseError(result.error)
    }

    return {
      id: result.value.id,
    }
  }),
  getById: authenticated.endpoint.getById.handler(async ({ context, input }) => {
    const result = await getEndpointById(context.db, {
      id: input.params.id,
      userId: context.user.id,
    })

    if (result.isErr()) {
      throw mapDatabaseError(result.error)
    }

    return result.value
  }),
})
