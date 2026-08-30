import { base } from './base.js'
import { authMiddleware } from './middlewares/auth.middleware.js'

export type { AuthContext, ORPCContext } from './base.js'

export const os = base
export const pub = base
export const authenticated = base.use(authMiddleware)
