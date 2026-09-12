import type {
  RequestHeadersPluginContext,
  ResponseHeadersPluginContext,
} from '@orpc/server/plugins'
import type { AppSession } from '@repo/auth/server'
import type { PostgresDatabase } from '@repo/db'
import type { EvlogOrpcContext } from 'evlog/orpc'
import type { HonoRequest } from 'hono'
import type { publisher } from '#/libs/publiser.js'
import { implement } from '@orpc/server'
import { contract } from '@repo/api-contracts'
import { evlog } from 'evlog/orpc'

export interface ORPCContext
  extends RequestHeadersPluginContext,
  ResponseHeadersPluginContext,
  EvlogOrpcContext {
  db: PostgresDatabase
  publisher: typeof publisher
  request?: HonoRequest
}

export type AuthContext = AppSession

export const middlewareBase = implement(contract)
  .$context<ORPCContext>()

export const base = middlewareBase.use(evlog())
