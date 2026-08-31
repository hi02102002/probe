import { createAppAuth } from '@repo/auth/server'
import { createResendMagicLinkSender } from '@repo/email'
import { resolveHttpUrl } from '@repo/utils'
import { getDatabase } from '#/db.js'
import { env } from '#/env.js'

let auth: ReturnType<typeof createAppAuth> | undefined

export function getAuth() {
  if (auth) {
    return auth
  }

  auth = createAppAuth({
    appName: env.APP_NAME,
    baseURL: resolveHttpUrl(
      env.BETTER_AUTH_URL,
      `http://localhost:${env.PORT}`,
    ),
    database: getDatabase(),
    github: env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
        }
      : undefined,
    google: env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        }
      : undefined,
    secret: env.BETTER_AUTH_SECRET,
    sendMagicLink: createResendMagicLinkSender({
      apiKey: env.RESEND_API_KEY,
      appName: env.APP_NAME,
      fromEmail: env.RESEND_FROM_EMAIL,
      publicOrigin: env.SERVER_URL,
    }),
    trustedOrigins: env.WEB_URL,
  })

  return auth
}
