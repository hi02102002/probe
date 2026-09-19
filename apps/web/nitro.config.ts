import { getProductionSamplingConfig } from '@repo/utils'
import evlog from 'evlog/nitro/v3'
import { defineConfig } from 'nitro'

export default defineConfig({
  routeRules: {
    '/**': {
      headers: {
        'Cache-Control': 'no-cache, must-revalidate',
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
