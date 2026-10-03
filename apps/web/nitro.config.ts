import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { getProductionSamplingConfig } from '@repo/utils'
import evlog from 'evlog/nitro/v3'
import { defineConfig } from 'nitro'

function getBuildVersion(): string {
  try {
    return (
      process.env.COMMIT_HASH
      || process.env.VERCEL_GIT_COMMIT_SHA
      || process.env.CF_PAGES_COMMIT_SHA
      || process.env.GITHUB_SHA?.slice(0, 7)
      || execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
    )
  }
  catch {
    return Date.now().toString(36)
  }
}

const buildVersion = getBuildVersion()

function getApiOrigin(): string {
  try {
    const contents = readFileSync(new URL('./.env', import.meta.url), 'utf-8')
    const value = contents.match(/^VITE_API_URL=(.+)$/m)?.[1]?.trim()

    if (value) {
      return new URL(value).origin
    }
  }
  catch {
    // .env is optional in production builds; fall back to the production API.
  }

  return 'https://probe-api.monobase.io.vn'
}

const apiOrigin = getApiOrigin()

// Local dev tools (react-grab, react-scan) load extra assets; the production
// CSP stays byte-for-byte the same as before.
const isLocalDev = /localhost|127\.0\.0\.1/.test(apiOrigin)

const contentSecurityPolicy = [
  'default-src \'self\'',
  `script-src 'self' 'unsafe-inline' https://umami.monobase.io.vn https://static.cloudflareinsights.com${isLocalDev ? ' blob:' : ''}`,
  // react-grab injects a Google Fonts stylesheet in dev; production stays
  // self-hosted via @fontsource.
  `style-src 'self' 'unsafe-inline'${isLocalDev ? ' https://fonts.googleapis.com' : ''}`,
  'img-src \'self\' data: blob: https:',
  `font-src 'self' data:${isLocalDev ? ' https://fonts.gstatic.com' : ''}`,
  `connect-src 'self' ${apiOrigin} https://umami.monobase.io.vn https://cloudflareinsights.com${isLocalDev ? ' https://react-grab.com https://www.react-grab.com https://fonts.googleapis.com' : ''}`,
  'frame-ancestors \'none\'',
  'object-src \'none\'',
  'base-uri \'self\'',
  'form-action \'self\'',
].join('; ')

export default defineConfig({
  handlers: [
    {
      handler: './server/middleware/etag.ts',
      middleware: true,
      route: '/**',
    },
  ],
  runtimeConfig: {
    app: {
      buildVersion,
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'Cache-Control': 'no-cache, must-revalidate',
        'Content-Security-Policy': contentSecurityPolicy,
        'Cross-Origin-Embedder-Policy': 'credentialless',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security':
          'max-age=31536000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    },
    '/assets/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
  },
  prerender: {
    routes: [
      '/terms',
      '/privacy',
      '/blog/test-webhooks-locally',
      '/blog/debug-failed-webhook-requests',
      '/blog/test-stripe-webhooks',
      '/blog/webhook-signature-verification',
      '/blog/webhook-testing-tools',
      '/sitemap.xml',
      '/llms.txt',
      '/llms-full.txt',
    ],
    failOnError: true,
  },
  experimental: {
    asyncContext: true,
  },
  plugins: [
    './server/plugins/evlog-enrich.ts',
  ],
  modules: [
    evlog({
      env: {
        service: 'probe-web',
      },
      exclude: [
        '/health',
        '/assets/**',
      ],
      redact: true,
      sampling: getProductionSamplingConfig(),
    }),
  ],
})
