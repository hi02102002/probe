import type { PostgresDatabase } from '@repo/db'
import type { BetterAuthOptions } from 'better-auth'
import type { MagicLinkOptions } from 'better-auth/plugins/magic-link'
import type { PolarPluginOptions } from './polar.js'
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import * as schema from '@repo/db/schema'
import { betterAuth } from 'better-auth'
import { magicLink } from 'better-auth/plugins/magic-link'
import { nanoid } from 'nanoid'
import { createPolarPlugin } from './polar.js'

export interface AppAuthOptions {
  appName?: string
  baseURL: string
  cookieDomain?: string
  database: PostgresDatabase
  github?: NonNullable<BetterAuthOptions['socialProviders']>['github']
  google?: NonNullable<BetterAuthOptions['socialProviders']>['google']
  polar?: PolarPluginOptions
  secret: BetterAuthOptions['secret']
  sendMagicLink: MagicLinkOptions['sendMagicLink']
  trustedOrigins?: BetterAuthOptions['trustedOrigins']
  /** Origin of the web app, used to leave Better Auth's built-in error page. */
  webURL?: string
}

export function createAppAuth(options: AppAuthOptions) {
  return betterAuth({
    advanced: {
      ...(options.cookieDomain
        ? {
            crossSubDomainCookies: {
              domain: options.cookieDomain,
              enabled: true,
            },
          }
        : {}),
      database: {
        generateId: () => nanoid(),
      },
      ipAddress: {
        ipAddressHeaders: ['x-forwarded-for', 'x-real-ip'],
      },
    },
    // Without this, auth errors (e.g. failed OAuth callbacks) land on the
    // built-in HTML error page served by the API; send them to the web app's
    // login screen with ?error= instead.
    ...(options.webURL
      ? { onAPIError: { errorURL: new URL('/login', options.webURL).toString() } }
      : {}),
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
      }),
      ...(options.polar
        ? [createPolarPlugin(options.database, options.polar)]
        : []),
    ],
    rateLimit: {
      customRules: {
        '/sign-in/magic-link': {
          max: 1,
          window: 60,
        },
        '*': false,
      },
      // eslint-disable-next-line node/prefer-global/process
      enabled: process.env.NODE_ENV === 'production',
    },
    secret: options.secret,
    socialProviders: {
      ...(options.github ? { github: options.github } : {}),
      ...(options.google ? { google: options.google } : {}),
    },
    trustedOrigins: options.trustedOrigins,
    user: {
      additionalFields: {
        plan: {
          defaultValue: 'free',
          input: false,
          type: 'string',
        },
      },
    },
  })
}

export type AppAuth = ReturnType<typeof createAppAuth>
export type AppSession = AppAuth['$Infer']['Session']
