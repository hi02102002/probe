import type { ORPCContext } from './base.js'
import { getDatabase } from '#/db.js'

export function createORPCContext(): Pick<ORPCContext, 'db'> {
  return {
    db: getDatabase(),
  }
}
