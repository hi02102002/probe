import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { MainLayout } from '@/components/layouts/dashboard/main-layout'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/{-$locale}/_protected')({
  beforeLoad: async ({ location, context, params }) => {
    if (!context.session) {
      throw redirect({
        to: '/{-$locale}/login',
        params: { locale: params.locale },
        search: {
          redirect: location.href,
        },
      })
    }

    return {
      session: context.session,
    }
  },
  component: RouteComponent,
  pendingComponent: ProtectedPending,
})

function ProtectedPending() {
  return (
    <div
      aria-label="Loading dashboard"
      aria-live="polite"
      className="dark flex min-h-svh flex-col items-center justify-center gap-3 bg-background text-foreground"
    >
      <Spinner className="size-5 text-primary" />
      <p className="text-sm text-muted-foreground">Preparing your dashboard…</p>
    </div>
  )
}

function RouteComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
