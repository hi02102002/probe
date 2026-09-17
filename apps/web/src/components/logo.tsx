import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/cn'

interface LogoProps {
  'classNames'?: {
    container?: string
    logo?: string
  }
  'isShowText'?: boolean
  'to'?: LinkProps['to']
  'data-umami-event'?: string
  'data-umami-event-button-name'?: string
}

export function Logo({
  classNames,
  isShowText = true,
  to = '/',
  'data-umami-event': dataUmamiEvent = 'Logo link clicked',
  'data-umami-event-button-name': dataUmamiEventButtonName = 'global__header__logo',
}: LogoProps) {
  return (
    <Link
      className={cn('inline-flex w-fit items-center gap-2.5 font-semibold text-lg tracking-tight', classNames?.container)}
      data-umami-event={dataUmamiEvent}
      data-umami-event-button-name={dataUmamiEventButtonName}
      to={to}
    >
      <img
        alt="Probe"
        className={cn('size-8 shrink-0 object-contain', classNames?.logo)}
        height={32}
        loading="eager"
        src="/app-mark.png"
        title="Probe"
        width={32}
      />
      {isShowText && <span>Probe</span>}
    </Link>
  )
}
