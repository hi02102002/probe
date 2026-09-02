import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import nprogress from 'nprogress'
import {
  getContext,
} from '@/integrations/tanstack-query/root-provider'
import { routeTree } from '@/routeTree.gen'

export function getRouter() {
  const context = getContext()

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

  if (typeof window !== 'undefined') {
    nprogress.configure({ showSpinner: false })

    router.subscribe('onBeforeLoad', ({ pathChanged }) => {
      if (pathChanged) {
        nprogress.start()
      }
    })

    router.subscribe('onLoad', () => {
      nprogress.done()
    })
  }

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
