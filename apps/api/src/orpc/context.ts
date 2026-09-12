import type { HonoRequest } from 'hono'
import type { ORPCContext } from './base.js'
import { getDatabase } from '#/db.js'
import { publisher } from '#/libs/publiser.js'

export function createORPCContext(
  request?: HonoRequest,
): Pick<ORPCContext, 'db' | 'publisher' | 'request'> {
  return {
    db: getDatabase(),
    publisher,
    request,
  }
}
