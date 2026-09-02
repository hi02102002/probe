import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/cn'

interface LogoProps {
  classNames?: {
    container?: string
    logo?: string
  }
  isShowText?: boolean
  to?: LinkProps['to']
}

export function Logo({
  classNames,
  isShowText = true,
  to = '/',
}: LogoProps) {
  return (
    <Link
      className={cn('inline-flex w-fit items-center gap-2.5 font-semibold text-lg tracking-tight', classNames?.container)}
      to={to}
    >
      <img
        alt="Probe"
        className={cn('size-8 shrink-0 object-contain', classNames?.logo)}
        src="/app-mark.png"
      />
      {isShowText && <span>Probe</span>}
    </Link>
  )
}
