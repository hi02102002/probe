import type { CommonDatabaseError } from '../errors/database.error.js'
import type { PostgresDatabase } from '../postgres/index.js'
import { Err, Ok, Result } from 'better-result'
import { toCommonDatabaseError } from '../errors/database.error.js'

function isResult(value: unknown): value is Result<unknown, unknown> {
  return value instanceof Ok || value instanceof Err
}

/**
 * Gives query definitions a typed database and converts thrown errors
 * into a typed Result with CommonDatabaseError.
 */
export function withDb<Arguments extends unknown[], Value, Error>(
  query: (
    database: PostgresDatabase,
    ...arguments_: Arguments
  ) => Promise<Result<Value, Error>>,
): (
  database: PostgresDatabase,
  ...arguments_: Arguments
) => Promise<Result<Value, CommonDatabaseError | Error>>
export function withDb<Arguments extends unknown[], Value>(
  query: (
    database: PostgresDatabase,
    ...arguments_: Arguments
  ) => Promise<Value>,
): (
  database: PostgresDatabase,
  ...arguments_: Arguments
) => Promise<Result<Value, CommonDatabaseError>>
export function withDb<Arguments extends unknown[]>(
  query: (
    database: PostgresDatabase,
    ...arguments_: Arguments
  ) => Promise<unknown>,
) {
  return async (database: PostgresDatabase, ...arguments_: Arguments) => {
    const result = await Result.tryPromise({
      catch: toCommonDatabaseError,
      try: () => query(database, ...arguments_),
    })

    if (result.isErr() || !isResult(result.value)) {
      return result
    }

    return result.value
  }
}
