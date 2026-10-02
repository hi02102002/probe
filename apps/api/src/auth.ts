import { createAppAuth } from '@repo/auth/server'
import { createResendMagicLinkSender } from '@repo/email'
import { resolveHttpUrl } from '@repo/utils'
import { getDatabase } from '#/db.js'
import { env } from '#/env.js'

let auth: ReturnType<typeof createAppAuth> | undefined

function getGoogleConfig() {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return undefined
  }

  return {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  }
}

function getGithubConfig() {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return undefined
  }

  return {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  }
}

function getPolarConfig() {
  if (!env.POLAR_ACCESS_TOKEN) {
    return undefined
  }

  return {
    accessToken: env.POLAR_ACCESS_TOKEN,
    premiumProductId: env.POLAR_PREMIUM_PRODUCT_ID,
    server: env.POLAR_SERVER,
    webhookSecret: env.POLAR_WEBHOOK_SECRET,
  }
}

const sendMagicLink = createResendMagicLinkSender({
  apiKey: env.RESEND_API_KEY,
  appName: env.APP_NAME,
  fromEmail: env.RESEND_FROM_EMAIL,
  publicOrigin: env.SERVER_URL,
})

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
    cookieDomain: env.AUTH_COOKIE_DOMAIN,
    database: getDatabase(),
    github: getGithubConfig(),
    google: getGoogleConfig(),
    polar: getPolarConfig(),
    secret: env.BETTER_AUTH_SECRET,
    sendMagicLink,
    trustedOrigins: env.WEB_URL,
  })

  return auth
}
