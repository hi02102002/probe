'use client'

import type React from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { cn } from '@/lib/cn'

export interface DataTableEmptyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
}

export function DataTableEmpty({
  title = 'No results found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  icon: Icon = MagnifyingGlassIcon,
  action,
  className,
  children,
  ...props
}: DataTableEmptyProps): React.ReactElement {
  return (
    <Empty className={cn('py-12 md:py-16', className)} {...props}>
      <EmptyHeader>
        {Icon && (
          <EmptyMedia variant="icon">
            <Icon className="size-5" />
          </EmptyMedia>
        )}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {(action || children) && (
        <EmptyContent>
          {action}
          {children}
        </EmptyContent>
      )}
    </Empty>
  )
}
