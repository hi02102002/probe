import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/cn'

interface LogoProps {
  'classNames'?: {
    container?: string
    logo?: string
  }
  'data-umami-event-button-name'?: string
  'data-umami-link-event'?: string
  'fetchPriority'?: 'auto' | 'high' | 'low'
  'isShowText'?: boolean
  'loading'?: 'eager' | 'lazy'
  'to'?: LinkProps['to']
}

export function Logo({
  classNames,
  fetchPriority = 'auto',
  isShowText = true,
  loading = 'eager',
  to = '/',
  'data-umami-link-event': dataUmamiLinkEvent = 'Logo link clicked',
  'data-umami-event-button-name': dataUmamiEventButtonName = 'global__header__logo',
}: LogoProps) {
  return (
    <Link
      className={cn('inline-flex w-fit items-center gap-2.5 font-semibold text-lg tracking-tight', classNames?.container)}
      data-umami-link-event={dataUmamiLinkEvent}
      data-umami-event-button-name={dataUmamiEventButtonName}
      to={to}
    >
      <picture className={cn('size-8 shrink-0', classNames?.logo)}>
        <source srcSet="/app-mark.webp" type="image/webp" />
        <img
          alt="Probe"
          className={cn('size-8 shrink-0 object-contain', classNames?.logo)}
          fetchPriority={fetchPriority}
          height={32}
          loading={loading}
          src="/app-mark.png"
          title="Probe"
          width={32}
        />
      </picture>
      {isShowText && <span>Probe</span>}
    </Link>
  )
}
