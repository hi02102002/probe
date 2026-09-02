import type { ReactNode, SVGProps } from 'react'
import { WebhooksLogoIcon } from '@phosphor-icons/react'
import {
  Clerk,
  Discord,
  Github,
  LemonSqueezy,
  Paypal,
  Resend,
  Shopify,
  Slack,
  Stripe,
  Supabase,
  Telegram,
} from '@/components/ui/svgs'
import { cn } from '@/lib/cn'

const PROVIDER_MAP = {
  chatgpt: 'openai',
  clerk: 'clerk',
  discord: 'discord',
  github: 'github',
  gitlab: 'gitlab',
  google: 'google',
  lemon: 'lemonsqueezy',
  linear: 'linear',
  openai: 'openai',
  paypal: 'paypal',
  posthog: 'posthog',
  resend: 'resend',
  shopify: 'shopify',
  slack: 'slack',
  stripe: 'stripe',
  supabase: 'supabase',
  telegram: 'telegram',
  whatsapp: 'whatsapp',
} as const

const PROVIDER_REGEX = new RegExp(
  Object.keys(PROVIDER_MAP).join('|'),
  'i',
)

export type BrandName = (typeof PROVIDER_MAP)[keyof typeof PROVIDER_MAP] | 'custom'

function getProvider(name?: string): BrandName {
  if (!name) {
    return 'custom'
  }

  const match = name.trim().match(PROVIDER_REGEX)

  if (!match) {
    return 'custom'
  }

  return PROVIDER_MAP[
    match[0].toLowerCase() as keyof typeof PROVIDER_MAP
  ]
}

export interface BrandIconProps extends SVGProps<SVGSVGElement> {
  brand?: BrandName
  className?: string
  fallback?: ReactNode
  name?: string
}

export function BrandIcon({
  brand: explicitBrand,
  className,
  fallback,
  name,
  ...props
}: BrandIconProps) {
  const brand = explicitBrand ?? getProvider(name)

  switch (brand) {
    case 'stripe':
      return <Stripe className={cn('size-4 shrink-0', className)} {...props} />

    case 'github':
      return <Github className={cn('size-4 shrink-0', className)} {...props} />

    case 'shopify':
      return <Shopify className={cn('size-4 shrink-0', className)} {...props} />

    case 'discord':
      return <Discord className={cn('size-4 shrink-0', className)} {...props} />

    case 'slack':
      return <Slack className={cn('size-4 shrink-0', className)} {...props} />

    case 'supabase':
      return <Supabase className={cn('size-4 shrink-0', className)} {...props} />

    case 'resend':
      return <Resend className={cn('size-4 shrink-0', className)} {...props} />

    case 'clerk':
      return <Clerk className={cn('size-4 shrink-0', className)} {...props} />

    case 'lemonsqueezy':
      return <LemonSqueezy className={cn('size-4 shrink-0', className)} {...props} />

    case 'paypal':
      return <Paypal className={cn('size-4 shrink-0', className)} {...props} />

    case 'telegram':
      return <Telegram className={cn('size-4 shrink-0', className)} {...props} />

    case 'custom':
    default:
      if (fallback) {
        return <>{fallback}</>
      }
      return (
        <WebhooksLogoIcon
          className={cn('size-4 shrink-0 text-muted-foreground', className)}
          weight="duotone"
          {...(props as any)}
        />
      )
  }
}
