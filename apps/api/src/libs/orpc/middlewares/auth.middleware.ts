import { ORPCError } from '@orpc/server'
import { getAuth } from '#/auth.js'
import { createI18n } from '#/libs/i18n/messages.js'
import { middlewareBase } from '#/libs/orpc/base.js'

export const authMiddleware = middlewareBase.middleware(async ({ context, next }) => {
  const sessionData = await getAuth().api.getSession({
    headers: context.reqHeaders ?? new Headers(),
  })

  if (!sessionData) {
    throw new ORPCError('UNAUTHORIZED', {
      message: createI18n(context.t).common.unauthorized(),
    })
  }

  return next({
    context: sessionData,
  })
})
