import contentCollections from '@content-collections/vite'
import mdx from '@mdx-js/rollup'
import { getProductionSamplingConfig } from '@repo/utils'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { rehypeHighlightCodeBlocks } from '@tanstack/highlight/rehype'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import evlog from 'evlog/vite'
import { nitro } from 'nitro/vite'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'
import { highlighter } from './src/lib/highlighter.ts'

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
      {
        enforce: 'pre',
        ...mdx({
          remarkPlugins: [remarkFrontmatter, remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeHighlightCodeBlocks, { highlighter }],
          ],
        }),
      },
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
      viteReact({ include: /\.(?:js|jsx|md|mdx|ts|tsx)$/ }),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
    resolve: { tsconfigPaths: true },
  }
})

export default config
