import type { LinkProps } from '@tanstack/react-router'
import { Link, useRouteContext } from '@tanstack/react-router'
import { LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { Logo } from '@/components/logo'
import { UserMenu } from './user-menu'

interface NavItem {
  exact?: boolean
  label: string
  to: LinkProps['to']
}

const ACTIVE_TAB_CLASS_NAME = 'pointer-events-none absolute inset-x-0 bottom-0 block h-0.5 bg-primary'

export function DashboardHeader() {
  const { session } = useRouteContext({ from: '/_protected' })
  const shouldReduceMotion = useReducedMotion()

  const navigators: NavItem[] = [
    {
      exact: true,
      label: 'Endpoints',
      to: '/dashboard',
    },
    {
      label: 'Endpoints',
      to: '/dashboard/endpoints',
    },
    {
      label: 'Billing',
      to: '/dashboard/billing',
    },
    {
      label: 'Settings',
      to: '/dashboard/settings',
    },
  ]

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Logo
          to="/dashboard"
        />
        <div className="ml-auto flex items-center gap-3">
          <UserMenu user={session.user} />
        </div>
      </div>
      <nav aria-label="Dashboard" className="mx-auto flex h-[47px] max-w-6xl items-end gap-5 overflow-x-auto px-4 sm:px-6">
        <LayoutGroup id="dashboard-navigation">
          {navigators.map(nav => (
            <Link
              key={nav.to}
              activeOptions={{ exact: nav.exact }}
              className="relative flex h-full items-center px-2 font-medium text-muted-foreground text-sm transition-colors duration-150 hover:text-foreground data-[status=active]:text-foreground"
              to={nav.to}
            >
              {({ isActive }) => (
                <>
                  {nav.label}
                  {isActive && (
                    <motion.span
                      aria-hidden="true"
                      className={ACTIVE_TAB_CLASS_NAME}
                      initial={false}
                      layoutId="active-tab"
                      transition={shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            bounce: 0.15,
                            duration: 0.3,
                            type: 'spring',
                          }}
                    />
                  )}
                </>
              )}
            </Link>
          ))}
        </LayoutGroup>
      </nav>
    </header>
  )
}
