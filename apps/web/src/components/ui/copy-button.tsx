'use client'

import type { VariantProps } from 'class-variance-authority'
import type React from 'react'
import type { buttonVariants } from '@/components/ui/button'
import { CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onCopy'> {
  /** The text string to copy to the clipboard */
  text: string
  /** Duration in milliseconds to show the copied state. Defaults to 2000ms. */
  timeout?: number
  /** Callback fired after successfully copying */
  onCopy?: (text: string) => void
  /** Button visual variant */
  variant?: VariantProps<typeof buttonVariants>['variant']
  /** Button size */
  size?: VariantProps<typeof buttonVariants>['size']
  /** Optional text label to display beside the icon */
  label?: React.ReactNode
  /** Optional text label to display when copied */
  copiedLabel?: React.ReactNode
  /** Custom icon when copied */
  copiedIcon?: React.ReactNode
  /** Custom default icon */
  icon?: React.ReactNode
}

/**
 * Accessible, coss-styled CopyButton component.
 * Supports icon-only (default) and labeled button modes with inline copied feedback.
 *
 * @example
 * ```tsx
 * <CopyButton text="https://probe.dev/ep/tok_123" size="icon-xs" variant="ghost" />
 * <CopyButton text="npm i probe" label="Copy" copiedLabel="Copied!" variant="outline" size="sm" />
 * ```
 */
export function CopyButton({
  text,
  timeout = 2000,
  onCopy,
  variant = 'ghost',
  size = 'icon-xs',
  label,
  copiedLabel,
  copiedIcon,
  icon,
  className,
  onClick,
  ...props
}: CopyButtonProps): React.ReactElement {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleCopy = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onClick?.(event)

      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        onCopy?.(text)

        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }

        timerRef.current = setTimeout(() => {
          setCopied(false)
        }, timeout)
      }
      catch (error) {
        console.error('Failed to copy text to clipboard:', error)
      }
    },
    [text, onCopy, timeout, onClick],
  )

  const defaultIcon = icon ?? <CopyIcon className="size-3.5 shrink-0" />
  const successIcon = copiedIcon ?? (
    <CheckIcon className="size-3.5 shrink-0 text-emerald-500" weight="bold" />
  )

  const ariaLabel = props['aria-label']
    ?? (copied ? 'Copied to clipboard' : 'Copy to clipboard')

  return (
    <Button
      aria-label={ariaLabel}
      aria-live="polite"
      className={cn(
        'transition-all duration-150',
        copied && 'text-emerald-500 hover:text-emerald-600',
        className,
      )}
      onClick={handleCopy}
      size={size}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      type="button"
      variant={variant}
      {...props}
    >
      {copied ? successIcon : defaultIcon}
      {label && (
        <span className="text-xs">
          {copied ? (copiedLabel ?? label) : label}
        </span>
      )}
    </Button>
  )
}
