import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import evlog from 'evlog/vite'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import { intlayer } from 'vite-intlayer'

const config = defineConfig(() => {
  return {
    server: {
      strictPort: true,
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
      intlayer({
        proxy: {
          ignore: req => req.url?.startsWith('/api') ?? false,
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
