import type { I18nTranslator } from '#/libs/i18n/messages.js'
import type { ORPCContext } from './base.js'
import { getDatabase } from '#/db.js'

export function createORPCContext(t: I18nTranslator): Pick<ORPCContext, 'db' | 't'> {
  return {
    db: getDatabase(),
    t,
  }
}
