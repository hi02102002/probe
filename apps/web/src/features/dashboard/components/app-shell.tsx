import type { Icon } from '@phosphor-icons/react'
import type { LinkProps } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

import { Fragment } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/cn'

export interface AppShellBreadcrumb {
  label: string
  linkProps?: LinkProps
  icon?: Icon
}

interface AppShellProps {
  breadcrumbs?: ReadonlyArray<AppShellBreadcrumb>
  children: ReactNode
  className?: string
}

export function AppShell({ breadcrumbs = [], children, className }: AppShellProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-6', className)}>
      {breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => {
              const isCurrentPage = index === breadcrumbs.length - 1
              const Icon = breadcrumb.icon
              const content = (
                <>
                  {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" weight="duotone" />}
                  <span>{breadcrumb.label}</span>
                </>
              )

              return (
                <Fragment key={breadcrumb.label}>
                  <BreadcrumbItem>
                    {breadcrumb.linkProps && !isCurrentPage
                      ? (
                          <BreadcrumbLink
                            className="inline-flex items-center gap-1.5"
                            render={<Link {...breadcrumb.linkProps} />}
                          >
                            {content}
                          </BreadcrumbLink>
                        )
                      : (
                          <BreadcrumbPage className="inline-flex items-center gap-1.5">
                            {content}
                          </BreadcrumbPage>
                        )}
                  </BreadcrumbItem>
                  {!isCurrentPage && <BreadcrumbSeparator />}
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      {children}
    </div>
  )
}
