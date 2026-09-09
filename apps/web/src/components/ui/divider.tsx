import type React from 'react'
import type { SeparatorPrimitive } from '@/components/ui/separator'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'

export interface DividerProps extends React.ComponentProps<'div'> {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  labelPosition?: 'start' | 'center' | 'end'
}

export function Divider({
  children,
  className,
  orientation = 'horizontal',
  decorative = true,
  labelPosition = 'center',
  ...props
}: DividerProps): React.ReactElement {
  if (!children) {
    return (
      <Separator
        className={className}
        orientation={orientation}
        {...(props as SeparatorPrimitive.Props)}
      />
    )
  }

  return (
    <div
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        'flex items-center text-muted-foreground text-xs',
        orientation === 'horizontal' ? 'w-full flex-row' : 'h-full flex-col',
        className,
      )}
      data-slot="divider"
      role={decorative ? 'none' : 'separator'}
      {...props}
    >
      <Separator
        className={cn(
          'flex-1',
          labelPosition === 'start' && (orientation === 'horizontal' ? 'max-w-4' : 'max-h-4'),
        )}
        orientation={orientation}
      />
      <span
        className={cn(
          'shrink-0 font-medium',
          orientation === 'horizontal' ? 'px-3' : 'py-2',
        )}
      >
        {children}
      </span>
      <Separator
        className={cn(
          'flex-1',
          labelPosition === 'end' && (orientation === 'horizontal' ? 'max-w-4' : 'max-h-4'),
        )}
        orientation={orientation}
      />
    </div>
  )
}
