'use client'

import type React from 'react'
import type { PopoverPrimitive } from '@/components/ui/popover'
import { mergeProps, useRender } from '@base-ui/react'
import { CaretUpDownIcon } from '@phosphor-icons/react'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { createContext, use, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'
import {
  Popover,
  PopoverClose,
  PopoverPrimitive as PopoverPrimitiveValue,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/cn'

interface PickerContextValue {
  filteredItems: readonly unknown[]
  loading: boolean
  query: string
  selectItem: (item: unknown) => void
  setQuery: React.Dispatch<React.SetStateAction<string>>
  value: string
}

const PickerContext = createContext<PickerContextValue | null>(null)

function usePickerContext() {
  const context = use(PickerContext)

  if (!context) {
    throw new Error('Picker components must be used within a Picker')
  }

  return context
}

type PickerProps<ItemValue> = React.ComponentProps<typeof Popover> & {
  defaultQuery?: string
  filterMode?: 'local' | 'server'
  items?: readonly ItemValue[]
  loading?: boolean
  query?: string
  value?: string
  defaultValue?: string
  onQueryChange?: (query: string) => void
  onValueChange?: (value: string) => void
  itemToStringLabel?: (item: ItemValue) => string
  itemToStringValue?: (item: ItemValue) => string
}

export function Picker<ItemValue>({
  children,
  defaultQuery = '',
  defaultValue = '',
  filterMode = 'local',
  itemToStringLabel,
  itemToStringValue = String,
  items = [],
  loading = false,
  onOpenChange,
  onQueryChange,
  onValueChange,
  query: queryProp,
  value: valueProp,
  ...props
}: PickerProps<ItemValue>): React.ReactElement {
  const [query, setQuery] = useControllableState({
    caller: 'Picker',
    defaultProp: defaultQuery,
    onChange: onQueryChange,
    prop: queryProp,
  })
  const [selectedValue, setSelectedValue] = useControllableState({
    caller: 'Picker',
    defaultProp: defaultValue,
    onChange: onValueChange,
    prop: valueProp,
  })

  const filteredItems = useMemo(() => {
    if (filterMode === 'server') {
      return items
    }

    const normalizedQuery = query.trim().toLocaleLowerCase()

    if (!normalizedQuery) {
      return items
    }

    return items.filter(item => (
      (itemToStringLabel?.(item) ?? itemToStringValue(item))
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    ))
  }, [filterMode, itemToStringLabel, itemToStringValue, items, query])

  const contextValue = useMemo<PickerContextValue>(() => ({
    filteredItems,
    loading,
    query,
    selectItem: item => setSelectedValue(itemToStringValue(item as ItemValue)),
    setQuery,
    value: selectedValue,
  }), [filteredItems, itemToStringValue, loading, query, selectedValue, setQuery, setSelectedValue])

  return (
    <PickerContext value={contextValue}>
      <Popover
        onOpenChange={(open, eventDetails) => {
          if (!open) {
            setQuery('')
          }

          onOpenChange?.(open, eventDetails)
        }}
        {...props}
      >
        {children}
      </Popover>
    </PickerContext>
  )
}

export function PickerTrigger({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<typeof PopoverTrigger>, 'render'>): React.ReactElement {
  return (
    <PopoverTrigger
      className={cn('gap-2', className)}
      render={<Button variant="ghost" />}
      {...props}
    >
      {children}
      <CaretUpDownIcon className="size-3.5 text-muted-foreground" />
    </PopoverTrigger>
  )
}

type PickerValueProps = Omit<useRender.ComponentProps<'span'>, 'children'> & {
  placeholder?: string
  children?: React.ReactNode | ((value: string) => React.ReactNode)
}

export function PickerValue({
  className,
  render,
  placeholder = 'Select…',
  children,
  ...props
}: PickerValueProps): React.ReactElement {
  const { value } = usePickerContext()
  const content = typeof children === 'function'
    ? children(value)
    : children

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>({
      className: cn('max-w-40 truncate font-medium max-sm:max-w-24', className),
      children: content ?? (value || placeholder),
    }, props),
  })
}

export function PickerContent({
  children,
  className,
  align = 'start',
  side = 'bottom',
  sideOffset = 5,
  ...props
}: PopoverPrimitive.Popup.Props & {
  align?: PopoverPrimitive.Positioner.Props['align']
  side?: PopoverPrimitive.Positioner.Props['side']
  sideOffset?: PopoverPrimitive.Positioner.Props['sideOffset']
}): React.ReactElement {
  return (
    <PopoverPrimitiveValue.Portal>
      <PopoverPrimitiveValue.Positioner
        align={align}
        className="z-50 max-w-(--available-width)"
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverPrimitiveValue.Popup
          className={cn(
            'dark flex max-h-[min(var(--available-height),28rem)] w-64 max-w-[calc(100vw-2rem)] origin-(--transform-origin) flex-col overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg/5 outline-none',
            className,
          )}
          {...props}
        >
          {children}
        </PopoverPrimitiveValue.Popup>
      </PopoverPrimitiveValue.Positioner>
    </PopoverPrimitiveValue.Portal>
  )
}

type PickerSearchProps = Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'> & {
  loading?: boolean
}

export function PickerSearch({
  className,
  placeholder = 'Find…',
  loading,
  ...props
}: PickerSearchProps): React.ReactElement {
  const { query, setQuery } = usePickerContext()

  return (
    <div className="relative shrink-0 border-b">
      <Input
        autoFocus
        className={cn(
          'rounded-none border-0 bg-transparent shadow-none before:hidden has-focus-visible:ring-0 [&_[data-slot=input]]:pe-14',
          className,
        )}
        nativeInput
        placeholder={placeholder}
        type="search"
        value={query}
        onChange={event => setQuery(event.target.value)}
        {...props}
      />
      {loading
        ? (
            <Spinner
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          )
        : (
            <Kbd className="absolute end-3 top-1/2 -translate-y-1/2 border border-white/15 bg-transparent text-foreground/80">
              Esc
            </Kbd>
          )}
    </div>
  )
}

export function PickerList<ItemValue>({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  children?: React.ReactNode | ((item: ItemValue, index: number) => React.ReactNode)
}): React.ReactElement {
  const { filteredItems } = usePickerContext()

  if (filteredItems.length === 0) {
    return <></>
  }

  return (
    <div
      className={cn('min-h-0 flex-1 overflow-y-auto p-1', className)}
      role="listbox"
      {...props}
    >
      {typeof children === 'function'
        ? filteredItems.map((item, index) => children(item as ItemValue, index))
        : children}
    </div>
  )
}

export function PickerEmpty({
  children = 'No results found.',
  className,
  ...props
}: React.ComponentProps<'div'>): React.ReactElement {
  const { filteredItems, loading } = usePickerContext()

  if (loading || filteredItems.length > 0) {
    return <></>
  }

  return (
    <div
      className={cn('py-8 text-center text-sm text-muted-foreground', className)}
      role="status"
      {...props}
    >
      {children}
    </div>
  )
}

export function PickerLoading({
  children = 'Loading…',
  className,
  ...props
}: React.ComponentProps<'div'>): React.ReactElement {
  const { loading } = usePickerContext()

  if (!loading) {
    return <></>
  }

  return (
    <div
      aria-live="polite"
      className={cn('flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground', className)}
      role="status"
      {...props}
    >
      <Spinner className="size-4" />
      {children}
    </div>
  )
}

export function PickerItem<ItemValue>({
  children,
  className,
  onClick,
  value,
  ...props
}: Omit<React.ComponentProps<typeof PopoverClose>, 'value'> & {
  value: ItemValue
}): React.ReactElement {
  const { selectItem } = usePickerContext()

  return (
    <PopoverClose
      className={cn(
        'flex min-h-8 w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-left text-base outline-none hover:bg-accent focus-visible:bg-accent aria-selected:bg-accent sm:min-h-7 sm:text-sm',
        className,
      )}
      role="option"
      type="button"
      onClick={(event) => {
        selectItem(value)
        onClick?.(event)
      }}
      {...props}
    >
      {children}
    </PopoverClose>
  )
}

export function PickerFooter({
  className,
  ...props
}: React.ComponentProps<'div'>): React.ReactElement {
  return (
    <div
      className={cn('shrink-0 border-t p-1', className)}
      data-slot="picker-footer"
      {...props}
    />
  )
}

export const PickerClose = PopoverClose
