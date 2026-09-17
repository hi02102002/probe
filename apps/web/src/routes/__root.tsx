import type { RouterContext } from '@/integrations/tanstack-query/root-provider'
import interWoff2 from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'
import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { createMiddleware } from '@tanstack/react-start'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import { NotFoundPage, RootErrorPage } from '@/components/error-pages'
import { AnchoredToastProvider, ToastProvider } from '@/components/ui/toast'
import { getAuthSessionQueryOptions } from '@/features/auth/api/auth-session'
import { useAuthIdentity } from '@/features/auth/hooks/use-auth-identity'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import { generateAppSeo } from '@/lib/seo'
import appCss from '@/styles.css?url'

if (import.meta.env.DEV && typeof window !== 'undefined') {
  void import('react-grab')
  void import('react-scan').then(({ scan }) => scan({ enabled: true }))
}

const evlogMiddleware = createMiddleware().server(async (options) => {
  try {
    const [{ useRequest: getRequest }, { enrichLogger }] = await Promise.all([
      import('nitro/context'),
      import('@repo/utils'),
    ])
    const req = getRequest()
    const log = req?.context?.log as { set: (fields: Record<string, unknown>) => void } | undefined
    if (log && req?.headers) {
      await enrichLogger(log, req.headers)
    }
  }
  catch {}

  const { evlogErrorHandler } = await import('evlog/nitro/v3')
  return evlogErrorHandler(options)
})

export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: RootErrorPage,
  head: ({ matches }: { matches: Array<{ pathname: string }> }) => {
    const leafPathname = matches[matches.length - 1]?.pathname ?? '/'
    const seo = generateAppSeo({
      includeDocumentMeta: true,
      pathname: leafPathname,
    })

    return {
      ...seo,
      links: [
        ...(seo.links ?? []),
        {
          rel: 'preload',
          href: interWoff2,
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: appCss,
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          href: '/logo.png',
        },
      ],
    }
  },
  notFoundComponent: NotFoundPage,
  component: RootDocument,
  server: {
    middleware: [evlogMiddleware],
  },
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.fetchQuery(
      getAuthSessionQueryOptions,
    )

    return { session }
  },
})

function RootDocument() {
  const { session } = Route.useRouteContext()

  useAuthIdentity(session)
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="k_VdZO2bs7aGmn50wh5Zit1hK_mNf7UAGWpriJK2eDE"
        />
        {import.meta.env.PROD && (
          <script
            defer
            src="https://umami.monobase.io.vn/script.js"
            data-website-id="54a92f58-5371-4b3a-8158-198fd1eb8bfe"
          />
        )}
        <HeadContent />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
          storageKey="probe-theme"
        >
          <NuqsAdapter>
            <ToastProvider position="top-center">
              <AnchoredToastProvider>
                <Outlet />
              </AnchoredToastProvider>
            </ToastProvider>
          </NuqsAdapter>
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  )
}
