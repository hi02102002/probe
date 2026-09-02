/* eslint-disable unicorn/throw-new-error */
import { isTaggedError, TaggedError } from 'better-result'

export class DatabaseError extends TaggedError('DatabaseError')<{
  cause?: unknown
  entity?: string
  operation?: 'create' | 'delete' | 'read' | 'update'
  message?: string
}> {}

export class NotFoundError extends TaggedError('NotFoundError')<{
  cause?: unknown
  entity: string
  identifier?: string
  message?: string
}> {}

export class ConflictError extends TaggedError('ConflictError')<{
  cause?: unknown
  entity: string
  field?: string
  message?: string
}> {}

export class InvalidInputError extends TaggedError('InvalidInputError')<{
  cause?: unknown
  field?: string
  message?: string
}> {}

export type CommonDatabaseError
  = | ConflictError
    | DatabaseError
    | InvalidInputError
    | NotFoundError

export function isCommonDatabaseError(
  error: unknown,
): error is CommonDatabaseError {
  return isTaggedError(error)
    && (error._tag === 'DatabaseError'
      || error._tag === 'NotFoundError'
      || error._tag === 'ConflictError'
      || error._tag === 'InvalidInputError')
}

function getStringProperty(value: unknown, property: string): string | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined
  }

  const propertyValue = Reflect.get(value, property)
  return typeof propertyValue === 'string' ? propertyValue : undefined
}

function getEntity(cause: unknown): string {
  const table = getStringProperty(cause, 'table_name')

  if (!table) {
    return 'record'
  }

  return table.endsWith('s') ? table.slice(0, -1) : table
}

export function toCommonDatabaseError(cause: unknown): CommonDatabaseError {
  if (isCommonDatabaseError(cause)) {
    return cause
  }

  const code = getStringProperty(cause, 'code')
  const field = getStringProperty(cause, 'column_name')
    ?? getStringProperty(cause, 'constraint_name')

  if (code === '23505') {
    const entity = getEntity(cause)

    return new ConflictError({
      cause,
      entity,
      field,
    })
  }

  if (code === '23502' || code === '23514' || code === '22P02') {
    return new InvalidInputError({
      cause,
      field,
    })
  }

  return new DatabaseError({
    cause,
  })
}
