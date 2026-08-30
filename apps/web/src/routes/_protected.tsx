import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import { MainLayout } from '@/features/dashboard/components/main-layout'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location, context }) => {
    if (!context.session) {
      throw redirect({
        to: '/login',
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
      role="status"
    >
      <Spinner className="size-5 text-lime-300" />
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
