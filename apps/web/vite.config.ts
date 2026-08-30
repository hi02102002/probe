import { resolveHttpUrl } from '@repo/utils'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import evlog from 'evlog/vite'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'
import { createWebServerEnv } from './src/env/server'

const config = defineConfig(({ mode }) => {
  const runtimeEnv = loadEnv(mode, '.', '')
  const env = createWebServerEnv(runtimeEnv)
  const apiOrigin = resolveHttpUrl(
    env.API_PROXY_TARGET,
    'http://localhost:3001',
  )

  return {
    nitro: {
      routeRules: {
        '/api/auth/**': {
          proxy: {
            to: `${apiOrigin}/api/auth/**`,
          },
        },
        '/api-rpc/**': {
          proxy: {
            to: `${apiOrigin}/api/**`,
          },
        },
      },
    },
    plugins: [
      devtools({
        consolePiping: {
          enabled: false,
        },
      }),
      evlog({
        client: {
          service: 'probe-web',
        },
        service: 'probe-web',
      }),
      nitro({ rollupConfig: { external: [/^@sentry\//] } }),
      tailwindcss(),
      tanstackStart({
        router: {
          routeFileIgnorePattern: '(^|/)_components(/|$)',
        },
      }),
      viteReact(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    resolve: { tsconfigPaths: true },
  }
})

export default config
