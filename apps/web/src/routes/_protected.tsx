import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { MainLayout } from '@/components/layouts/dashboard/main-layout'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context, location }) => {
    if (!context.session) {
      throw redirect({
        search: {
          redirect: location.href,
        },
        to: '/login',
      })
    }

    return {
      session: context.session,
    }
  },
  component: RouteComponent,
  pendingComponent: () => {
    return (
      <div
        className="flex h-screen w-screen flex-col items-center justify-center gap-2"
      >
        <Spinner
          className="size-6 animate-spin text-primary"
        />
        <span>Loading dashboard...</span>
      </div>
    )
  },
  ssr: false,
})

function RouteComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
