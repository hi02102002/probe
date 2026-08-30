import { useRouteContext } from '@tanstack/react-router'
import { LocalizedLogo } from '@/components/localized-logo'
import { UserMenu } from './user-menu'

export function DashboardHeader() {
  const { session } = useRouteContext({ from: '/{-$locale}/_protected' })

  return (
    <header className="sticky top-0 z-40 border-b bg-accent backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <LocalizedLogo to="/dashboard" />
        <div className="ml-auto flex items-center gap-2">
          <UserMenu user={session.user} />
        </div>
      </div>
    </header>
  )
}
