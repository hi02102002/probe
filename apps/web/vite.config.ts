import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import evlog from 'evlog/vite'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

const config = defineConfig(() => {
  return {
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
