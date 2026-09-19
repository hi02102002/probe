import { getProductionSamplingConfig } from '@repo/utils'
import evlog from 'evlog/nitro/v3'
import { defineConfig } from 'nitro'

export default defineConfig({
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
