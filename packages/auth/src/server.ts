import type { PostgresDatabase } from '@repo/db'
import type { BetterAuthOptions } from 'better-auth'
import type { MagicLinkOptions } from 'better-auth/plugins/magic-link'
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import * as schema from '@repo/db/schema'
import { betterAuth } from 'better-auth'
import { magicLink } from 'better-auth/plugins/magic-link'
import { nanoid } from 'nanoid'

export interface AppAuthOptions {
  appName?: string
  baseURL: string
  database: PostgresDatabase
  github?: NonNullable<BetterAuthOptions['socialProviders']>['github']
  google?: NonNullable<BetterAuthOptions['socialProviders']>['google']
  secret: BetterAuthOptions['secret']
  sendMagicLink: MagicLinkOptions['sendMagicLink']
  trustedOrigins?: BetterAuthOptions['trustedOrigins']
}

export function createAppAuth(options: AppAuthOptions) {
  return betterAuth({
    advanced: {
      database: {
        generateId: () => nanoid(),
      },
    },
    appName: options.appName ?? 'Probe',
    baseURL: options.baseURL,
    database: drizzleAdapter(options.database, {
      provider: 'pg',
      transaction: true,
      schema: {
        account: schema.account,
        session: schema.session,
        user: schema.user,
        verification: schema.verification,
      },
    }),
    plugins: [
      magicLink({
        expiresIn: 10 * 60,
        sendMagicLink: options.sendMagicLink,
        storeToken: 'hashed',
        rateLimit: {
          max: 2,
          window: 60,
        },
      }),
    ],
    secret: options.secret,
    socialProviders: {
      ...(options.github ? { github: options.github } : {}),
      ...(options.google ? { google: options.google } : {}),
    },
    trustedOrigins: options.trustedOrigins,
  })
}

export type AppAuth = ReturnType<typeof createAppAuth>
export type AppSession = AppAuth['$Infer']['Session']
