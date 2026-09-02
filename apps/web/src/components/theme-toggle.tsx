'use client'

import { DesktopIcon, MoonStarsIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/cn'

interface ThemeToggleProps {
  className?: string
  size?: 'default' | 'sm'
}

const THEME_OPTIONS = [
  {
    icon: SunIcon,
    label: 'Light theme',
    value: 'light',
  },
  {
    icon: DesktopIcon,
    label: 'System theme',
    value: 'system',
  },
  {
    icon: MoonStarsIcon,
    label: 'Dark theme',
    value: 'dark',
  },
] as const

const emptySubscribe = () => () => {}

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

export function ThemeToggle({ className, size = 'sm' }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme()
  const mounted = useMounted()

  const isSmall = size === 'sm'

  return (
    <div
      aria-label="Select theme"
      className={cn(
        'inline-flex items-center rounded-full border border-border/80 bg-muted/50 p-0.5 shadow-xs/5',
        isSmall ? 'h-7 gap-0.5' : 'h-8 gap-1 p-1',
        className,
      )}
      onClick={e => e.stopPropagation()}
      role="radiogroup"
    >
      {THEME_OPTIONS.map(({ icon: Icon, label, value }) => {
        const isActive = mounted && theme === value

        return (
          <button
            key={value}
            aria-checked={isActive}
            aria-label={label}
            className={cn(
              'relative flex items-center justify-center rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              isSmall ? 'size-6' : 'size-6.5',
              isActive
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={(e) => {
              e.stopPropagation()
              setTheme(value)
            }}
            role="radio"
            type="button"
          >
            <Icon
              aria-hidden="true"
              className={cn(isSmall ? 'size-3.5' : 'size-4', 'shrink-0')}
              weight={isActive ? 'bold' : 'regular'}
            />
          </button>
        )
      })}
    </div>
  )
}
