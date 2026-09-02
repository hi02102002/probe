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
import { evlogErrorHandler } from 'evlog/nitro/v3'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import { NotFoundPage, RootErrorPage } from '@/components/error-pages'
import { AnchoredToastProvider, ToastProvider } from '@/components/ui/toast'
import { getAuthSessionQueryOptions } from '@/features/auth/api/get-auth-session'
import { useAuthIdentity } from '@/hooks/use-auth-identity'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import { generateAppSeo } from '@/lib/seo'
import appCss from '@/styles.css?url'

const evlogMiddleware = createMiddleware().server(evlogErrorHandler)

export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: RootErrorPage,
  head: () => {
    const seo = generateAppSeo({
      includeDocumentMeta: true,
      pathname: '/',
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
