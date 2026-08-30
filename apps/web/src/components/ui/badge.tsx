'use client'

import type { VariantProps } from 'class-variance-authority'
import type React from 'react'
import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

export const badgeVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-sm border border-transparent font-medium outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*=\'opacity-\'])]:opacity-80 [&_svg:not([class*=\'size-\'])]:size-3.5 sm:[&_svg:not([class*=\'size-\'])]:size-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [button&,a&]:cursor-pointer [button&,a&]:pointer-coarse:after:absolute [button&,a&]:pointer-coarse:after:size-full [button&,a&]:pointer-coarse:after:min-h-11 [button&,a&]:pointer-coarse:after:min-w-11',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default:
          'h-5.5 min-w-5.5 px-[calc(--spacing(1)-1px)] text-sm sm:h-4.5 sm:min-w-4.5 sm:text-xs',
        lg: 'h-6.5 min-w-6.5 px-[calc(--spacing(1.5)-1px)] text-base sm:h-5.5 sm:min-w-5.5 sm:text-sm',
        sm: 'h-5 min-w-5 rounded-[.25rem] px-[calc(--spacing(1)-1px)] text-xs sm:h-4 sm:min-w-4 sm:text-[.625rem]',
      },
      variant: {
        default:
          'bg-primary text-primary-foreground [button&,a&]:hover:bg-primary/90',
        destructive:
          'bg-destructive text-white [button&,a&]:hover:bg-destructive/90',
        error:
          'bg-destructive/8 text-destructive-foreground dark:bg-destructive/16',
        info: 'bg-info/8 text-info-foreground dark:bg-info/16',
        outline:
          'border-input bg-background text-foreground dark:bg-input/32 [button&,a&]:hover:bg-accent/50 dark:[button&,a&]:hover:bg-input/48',
        secondary:
          'bg-secondary text-secondary-foreground [button&,a&]:hover:bg-secondary/90',
        success: 'bg-success/8 text-success-foreground dark:bg-success/16',
        warning: 'bg-warning/8 text-warning-foreground dark:bg-warning/16',
        ghost:
          'bg-transparent text-foreground [button&,a&]:hover:bg-accent/50 dark:[button&,a&]:hover:bg-input/48',
        link: 'bg-transparent text-primary underline-offset-4 hover:underline [button&,a&]:hover:bg-accent/50 dark:[button&,a&]:hover:bg-input/48',
        subtle:
          'bg-accent text-foreground [button&,a&]:hover:bg-accent/50 dark:bg-accent/32 dark:[button&,a&]:hover:bg-input/48',
        gray: 'bg-gray-100 text-gray-900 [button&,a&]:hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-100 dark:[button&,a&]:hover:bg-gray-500',
        red: 'bg-red-100 text-red-900 [button&,a&]:hover:bg-red-200 dark:bg-red-600 dark:text-red-100 dark:[button&,a&]:hover:bg-red-500',
        green: 'bg-green-100 text-green-900 [button&,a&]:hover:bg-green-200 dark:bg-green-600 dark:text-green-100 dark:[button&,a&]:hover:bg-green-500',
        blue: 'bg-blue-100 text-blue-900 [button&,a&]:hover:bg-blue-200 dark:bg-blue-600 dark:text-blue-100 dark:[button&,a&]:hover:bg-blue-500',
        yellow: 'bg-yellow-100 text-yellow-900 [button&,a&]:hover:bg-yellow-200 dark:bg-yellow-600 dark:text-yellow-100 dark:[button&,a&]:hover:bg-yellow-500',
      },
    },
  },
)

export interface BadgeProps extends useRender.ComponentProps<'span'> {
  variant?: VariantProps<typeof badgeVariants>['variant']
  size?: VariantProps<typeof badgeVariants>['size']
}

export function Badge({
  className,
  variant,
  size,
  render,
  ...props
}: BadgeProps): React.ReactElement {
  const defaultProps = {
    'className': cn(badgeVariants({ className, size, variant })),
    'data-slot': 'badge',
  }

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    render,
  })
}
