import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/cn'

interface Props {
  classNames?: {
    container?: string
    logo?: string
  }
  to?: LinkProps['to']
  isShowText?: boolean
}

export function Logo({
  classNames,
  to,
  isShowText = true,
  ...props
}: Props) {
  return (
    <Link
      className={cn('inline-flex w-fit items-center gap-2.5 font-semibold text-lg tracking-tight', classNames?.container)}
      to={to ?? '.'}
      {...props}
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
