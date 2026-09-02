import { ORPCError } from '@orpc/server'
import { getAuth } from '#/auth.js'
import { middlewareBase } from '#/libs/orpc/base.js'

export const authMiddleware = middlewareBase.middleware(async ({ context, next }) => {
  const sessionData = await getAuth().api.getSession({
    headers: context.reqHeaders ?? new Headers(),
  })

  if (!sessionData) {
    throw new ORPCError('UNAUTHORIZED', {
      message: 'Unauthorized',
    })
  }

  return next({
    context: sessionData,
  })
})
