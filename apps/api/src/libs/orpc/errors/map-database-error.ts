import { ORPCError } from '@orpc/server'
import {
  ConflictError,
  InvalidInputError,
  NotFoundError,
} from '@repo/db'

export function mapDatabaseError(error: unknown) {
  if (NotFoundError.is(error)) {
    return new ORPCError('NOT_FOUND', {
      cause: error.cause,
      data: {
        entity: error.entity,
        identifier: error.identifier,
      },
      message: `${error.entity} not found`,
    })
  }

  if (ConflictError.is(error)) {
    return new ORPCError('CONFLICT', {
      cause: error.cause,
      data: {
        entity: error.entity,
        field: error.field,
      },
      message: `${error.entity} already exists`,
    })
  }

  if (InvalidInputError.is(error)) {
    return new ORPCError('BAD_REQUEST', {
      cause: error.cause,
      data: {
        field: error.field,
      },
      message: error.field ? `Invalid field '${error.field}'` : 'Invalid database input',
    })
  }

  return new ORPCError('INTERNAL_SERVER_ERROR', {
    cause: error,
    message: 'Internal server error',
  })
}
