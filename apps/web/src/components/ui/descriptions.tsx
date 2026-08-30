'use client'

import { mergeProps, useRender } from '@base-ui/react'
import * as React from 'react'
import { cn } from '@/lib/cn'

type DescriptionsLayout = 'horizontal' | 'vertical'
type DescriptionsSize = 'sm' | 'default' | 'lg'

interface ResponsiveValue {
  'base'?: number
  'sm'?: number
  'md'?: number
  'lg'?: number
  'xl'?: number
  '2xl'?: number
  '3xl'?: number
}

type Columns = number | ResponsiveValue

interface DescriptionsContextValue {
  bordered: boolean
  colon: boolean
  layout: DescriptionsLayout
  size: DescriptionsSize
}

const DescriptionsContext
  = React.createContext<DescriptionsContextValue | null>(null)

function useDescriptions() {
  const context = React.useContext(DescriptionsContext)

  if (!context) {
    throw new Error(
      'Descriptions components must be used inside <Descriptions />',
    )
  }

  return context
}

type DescriptionsProps
  = React.HTMLAttributes<HTMLDivElement> & {
    bordered?: boolean
    colon?: boolean
    layout?: DescriptionsLayout
    size?: DescriptionsSize
  } & useRender.ComponentProps<'p'>

/**
 * @useage
 * <Descriptions bordered>
 *   <DescriptionsHeader>
 *     <DescriptionsTitle>Profile</DescriptionsTitle>
 *     <DescriptionsActions>
 *       <button>Edit</button>
 *     </DescriptionsActions>
 *   </DescriptionsHeader>
 *
 *   <DescriptionsContent columns={{ base: 1, md: 2, xl: 3 }}>
 *     <DescriptionsItem label="Name">Jane Doe</DescriptionsItem>
 *     <DescriptionsItem label="Email">jane@example.com</DescriptionsItem>
 *     <DescriptionsItem label="Role" span="full">Admin</DescriptionsItem>
 *   </DescriptionsContent>
 * </Descriptions>
 */
function Descriptions({ ref, className, bordered = false, colon = true, layout = 'horizontal', size = 'default', render, ...props }: DescriptionsProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  const el = useRender({
    ref,
    defaultTagName: 'div',
    props: mergeProps<'div'>({
      'className': cn('w-full', className),
      // @ts-expect-error - React doesn't know about these data attributes, but they are valid HTML attributes.
      'data-slot': 'descriptions',
      'data-bordered': bordered,
      'data-layout': layout,
      'data-size': size,
    }, props),
    render,
  })

  return (
    <DescriptionsContext.Provider
      value={{
        bordered,
        colon,
        layout,
        size,
      }}
    >
      {el}
    </DescriptionsContext.Provider>
  )
}
Descriptions.displayName = 'Descriptions'

function DescriptionsHeader({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={ref}
      data-slot="descriptions-header"
      className={cn(
        'mb-4 flex items-center justify-between gap-4',
        className,
      )}
      {...props}
    />
  )
}
DescriptionsHeader.displayName = 'DescriptionsHeader'

function DescriptionsTitle({ ref, className, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { ref?: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <h3
      ref={ref}
      data-slot="descriptions-title"
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className,
      )}
      {...props}
    />
  )
}
DescriptionsTitle.displayName = 'DescriptionsTitle'

function DescriptionsDescription({ ref, className, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <p
      ref={ref}
      data-slot="descriptions-description"
      className={cn(
        'text-sm text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
DescriptionsDescription.displayName = 'DescriptionsDescription'

interface DescriptionsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  columns?: Columns
}

function DescriptionsContent({ ref, className, columns, style, ...props }: DescriptionsContentProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  const { bordered } = useDescriptions()

  const values
    = typeof columns === 'number'
      ? {
          'base': columns,
          'sm': columns,
          'md': columns,
          'lg': columns,
          'xl': columns,
          '2xl': columns,
          '3xl': columns,
        }
      : {
        // Close to Ant Design's defaults:
        // xs=1, sm=2, md-lg-xl-xxl=3, xxxl=4
          'base': columns?.base ?? 1,
          'sm': columns?.sm ?? 2,
          'md': columns?.md ?? 3,
          'lg': columns?.lg ?? columns?.md ?? 3,
          'xl': columns?.xl ?? columns?.lg ?? columns?.md ?? 3,
          '2xl':
          columns?.['2xl']
          ?? columns?.xl
          ?? columns?.lg
          ?? columns?.md
          ?? 3,
          '3xl':
          columns?.['3xl']
          ?? columns?.['2xl']
          ?? columns?.xl
          ?? 4,
        }

  const cssVariables = {
    '--descriptions-columns': values.base,
    '--descriptions-columns-sm': values.sm,
    '--descriptions-columns-md': values.md,
    '--descriptions-columns-lg': values.lg,
    '--descriptions-columns-xl': values.xl,
    '--descriptions-columns-2xl': values['2xl'],
    '--descriptions-columns-3xl': values['3xl'],
    ...style,
  } as React.CSSProperties

  return (
    <div
      ref={ref}
      data-slot="descriptions-content"
      style={cssVariables}
      className={cn(
        'grid',
        'grid-cols-[repeat(var(--descriptions-columns),minmax(0,1fr))]',
        'sm:grid-cols-[repeat(var(--descriptions-columns-sm),minmax(0,1fr))]',
        'md:grid-cols-[repeat(var(--descriptions-columns-md),minmax(0,1fr))]',
        'lg:grid-cols-[repeat(var(--descriptions-columns-lg),minmax(0,1fr))]',
        'xl:grid-cols-[repeat(var(--descriptions-columns-xl),minmax(0,1fr))]',
        '2xl:grid-cols-[repeat(var(--descriptions-columns-2xl),minmax(0,1fr))]',
        'min-[1600px]:grid-cols-[repeat(var(--descriptions-columns-3xl),minmax(0,1fr))]',

        bordered
          ? 'overflow-hidden rounded-lg border bg-border gap-px'
          : 'gap-x-8 gap-y-4',

        className,
      )}
      {...props}
    />
  )
}
DescriptionsContent.displayName = 'DescriptionsContent'

interface DescriptionsItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  span?: number | 'full'
}

function DescriptionsItem({ ref, className, span = 1, style, ...props }: DescriptionsItemProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  const { bordered, layout, size } = useDescriptions()

  const spanStyle
    = span === 'full'
      ? { gridColumn: '1 / -1' }
      : { gridColumn: `span ${span} / span ${span}` }

  return (
    <div
      ref={ref}
      data-slot="descriptions-item"
      style={{
        ...spanStyle,
        ...style,
      }}
      className={cn(
        'min-w-0',

        layout === 'horizontal'
          ? 'grid grid-cols-[minmax(0,max-content)_minmax(0,1fr)]'
          : 'flex flex-col',

        bordered && 'bg-background',

        size === 'sm' && bordered && '[&>*]:px-3 [&>*]:py-2',
        size === 'default' && bordered && '[&>*]:px-4 [&>*]:py-3',
        size === 'lg' && bordered && '[&>*]:px-5 [&>*]:py-4',

        !bordered && layout === 'horizontal' && 'gap-x-3',
        !bordered && layout === 'vertical' && 'gap-y-1',

        className,
      )}
      {...props}
    />
  )
}
DescriptionsItem.displayName = 'DescriptionsItem'

function DescriptionsLabel({ ref, className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
  const { bordered, colon, layout } = useDescriptions()

  return (
    <div
      ref={ref}
      data-slot="descriptions-label"
      className={cn(
        'text-sm font-medium text-muted-foreground',

        bordered && 'bg-muted/50',
        bordered
        && layout === 'horizontal'
        && 'border-r',

        className,
      )}
      {...props}
    >
      {children}
      {colon && layout === 'horizontal'
        ? (
            <span aria-hidden="true">:</span>
          )
        : null}
    </div>
  )
}
DescriptionsLabel.displayName = 'DescriptionsLabel'

function DescriptionsValue({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
  const { bordered } = useDescriptions()

  return (
    <div
      ref={ref}
      data-slot="descriptions-value"
      className={cn(
        'min-w-0 text-sm text-foreground',
        !bordered && 'leading-6',
        className,
      )}
      {...props}
    />
  )
}
DescriptionsValue.displayName = 'DescriptionsValue'

export {
  Descriptions,
  DescriptionsContent,
  DescriptionsDescription,
  DescriptionsHeader,
  DescriptionsItem,
  DescriptionsLabel,
  DescriptionsTitle,
  DescriptionsValue,
}
