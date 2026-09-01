import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { MainLayout } from '@/components/layouts/dashboard/main-layout'

export const Route = createFileRoute('/{-$locale}/_protected')({
  beforeLoad: ({ context, location, params }) => {
    if (!context.session) {
      throw redirect({
        params: { locale: params.locale },
        search: {
          redirect: location.href,
        },
        to: '/{-$locale}/login',
      })
    }

    return {
      session: context.session,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
