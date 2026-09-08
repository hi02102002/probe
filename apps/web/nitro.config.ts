import evlog from 'evlog/nitro/v3'
import { defineConfig } from 'nitro'

export default defineConfig({
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
    }),
  ],
})
