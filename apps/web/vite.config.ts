import contentCollections from '@content-collections/vite'
import { getProductionSamplingConfig } from '@repo/utils'
/** biome-ignore-all lint/suspicious/noExplicitAny: <hono> */
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import evlog from 'evlog/vite'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

const EVLOG_CONFIG = {
  env: { service: 'probe-web' },
  exclude: [
    '/health',
    '/assets/**',
  ],
  redact: true,
  sampling: getProductionSamplingConfig(),
}

const config = defineConfig(() => {
  return {
    define: {
      __EVLOG_CONFIG__: JSON.stringify(EVLOG_CONFIG),
    },
    envDir: '../../',
    envPrefix: ['VITE_', 'SERVER_', 'WEB_'],
    server: {
      strictPort: true,
    },
    plugins: [
      devtools({
        consolePiping: {
          enabled: false,
        },
      }),
      evlog(EVLOG_CONFIG as any),
      nitro({ rollupConfig: { external: [/^@sentry\//] } }),
      tailwindcss(),
      contentCollections({ configPath: './content-collections.ts' }),
      tanstackStart(),
      viteReact(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
    resolve: { tsconfigPaths: true },
  }
})

export default config
