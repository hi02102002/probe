import { useRouteContext } from '@tanstack/react-router'
import { AppShell } from './components/app-shell'
import { PageHeader, PageHeaderDescription, PageHeaderTitle } from './components/page-header'

export function DashboardPage() {
  const { session } = useRouteContext({
    from: '/{-$locale}/_protected',
  })

  return (
    <AppShell>
      <PageHeader>
        <PageHeaderTitle>
          Welcome,
          {' '}
          {session.user.name}
        </PageHeaderTitle>
        <PageHeaderDescription>
          Authentication is working. Build the Webhook Debugger product from this protected dashboard.
          Authentication is working. Build the Probe product from this protected dashboard.
        </PageHeaderDescription>
      </PageHeader>
    </AppShell>
  )
}
