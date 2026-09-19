import { execSync } from 'node:child_process'
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
const etagValue = `W/"probe-${buildVersion}"`

export default defineConfig({
  runtimeConfig: {
    app: {
      buildVersion,
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'Cache-Control': 'no-cache, must-revalidate',
        'ETag': etagValue,
        'Content-Security-Policy':
          'default-src \'self\'; script-src \'self\' \'unsafe-inline\' https://umami.monobase.io.vn; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: blob: https:; font-src \'self\' data:; connect-src \'self\' https://probe-api.monobase.io.vn https://umami.monobase.io.vn; frame-ancestors \'none\'; object-src \'none\'; base-uri \'self\'; form-action \'self\';',
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
    './server/plugins/etag.ts',
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
