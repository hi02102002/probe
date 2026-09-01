/** biome-ignore-all lint/suspicious/noExplicitAny: <hono> */
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import evlog from 'evlog/vite'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import { intlayer } from 'vite-intlayer'

const EVLOG_CONFIG = {
  env: { service: 'probe-web' },
  exclude: [
    '/health',
    '/assets/**',
  ],
  redact: true,
}

const ROUTE_IGNORE_PROXY = [
  '/api',
  '/health',
  '/og-image',
  '/assets',
]

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
      intlayer({
        proxy: {
          ignore: (req) => {
            if (!req.url) {
              return false
            }

            return ROUTE_IGNORE_PROXY.some(route => req.url?.startsWith(route))
          },
        },
      }),
      tailwindcss(),
      tanstackStart({
        router: {
          routeFileIgnorePattern:
            '((^|/)_components(/|$)|\\.content\\.(ts|tsx|js|mjs|cjs|jsx|json|jsonc|json5|md|mdx|yaml|yml)$)',
        },
      }),
      viteReact(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    resolve: { tsconfigPaths: true },
  }
})

export default config
