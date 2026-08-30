import type { To } from '@/components/localized-link'
import { LocalizedLink } from '@/components/localized-link'
import { cn } from '@/lib/cn'

interface Props {
  classNames?: {
    container?: string
    logo?: string
  }
  isShowText?: boolean
  to?: To
}

export function LocalizedLogo({
  classNames,
  isShowText = true,
  to,
  ...props
}: Props) {
  return (
    <LocalizedLink
      className={cn('inline-flex w-fit items-center gap-2.5 font-semibold text-lg tracking-tight', classNames?.container)}
      to={to ?? '/'}
      {...props}
    >
      <img
        alt="Probe"
        className={cn('size-8 shrink-0 object-contain', classNames?.logo)}
        src="/app-mark.png"
      />
      {isShowText && <span>Probe</span>}
    </LocalizedLink>
  )
}
