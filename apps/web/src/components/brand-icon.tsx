import type { ReactNode, SVGProps } from 'react'
import { WebhooksLogoIcon } from '@phosphor-icons/react'
import {
  Anthropic,
  Atlassian,
  Auth0,
  AWS,
  BetterAuth,
  Claude,
  Clerk,
  Cloudflare,
  Discord,
  Docker,
  Github,
  Gitlab,
  Google,
  LemonSqueezy,
  Linear,
  Meta,
  Notion,
  OpenAI,
  Paypal,
  Posthog,
  Prisma,
  Resend,
  Sentry,
  Shopify,
  Slack,
  Stripe,
  Supabase,
  Telegram,
  TikTok,
  Turso,
  Twilio,
  Upstash,
  Vercel,
  X,
} from '@/components/ui/svgs'
import { cn } from '@/lib/cn'

const PROVIDER_MAP = {
  'amazon': 'aws',
  'anthropic': 'anthropic',
  'atlassian': 'atlassian',
  'auth0': 'auth0',
  'aws': 'aws',
  'better-auth': 'betterauth',
  'better_auth': 'betterauth',
  'betterauth': 'betterauth',
  'chatgpt': 'openai',
  'claude': 'claude',
  'clerk': 'clerk',
  'cloudflare': 'cloudflare',
  'discord': 'discord',
  'docker': 'docker',
  'facebook': 'meta',
  'fb': 'meta',
  'github': 'github',
  'gitlab': 'gitlab',
  'google': 'google',
  'lemonsqueezy': 'lemonsqueezy',
  'lemon': 'lemonsqueezy',
  'linear': 'linear',
  'meta': 'meta',
  'notion': 'notion',
  'openai': 'openai',
  'paypal': 'paypal',
  'posthog': 'posthog',
  'prisma': 'prisma',
  'resend': 'resend',
  'sentry': 'sentry',
  'shopify': 'shopify',
  'slack': 'slack',
  'stripe': 'stripe',
  'supabase': 'supabase',
  'telegram': 'telegram',
  'tele': 'telegram',
  'tiktok': 'tiktok',
  'tik-tok': 'tiktok',
  'turso': 'turso',
  'twilio': 'twilio',
  'twitter': 'x',
  'upstash': 'upstash',
  'vercel': 'vercel',
  'x': 'x',
} as const

// Sort by length descending to match longer keywords first (e.g. lemonsqueezy before lemon)
const PROVIDER_REGEX = new RegExp(
  Object.keys(PROVIDER_MAP)
    .sort((a, b) => b.length - a.length)
    .join('|'),
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

    case 'tiktok':
      return <TikTok className={cn('size-4 shrink-0', className)} {...props} />

    case 'linear':
      return <Linear className={cn('size-4 shrink-0', className)} {...props} />

    case 'openai':
      return <OpenAI className={cn('size-4 shrink-0', className)} {...props} />

    case 'claude':
      return <Claude className={cn('size-4 shrink-0', className)} {...props} />

    case 'anthropic':
      return <Anthropic className={cn('size-4 shrink-0', className)} {...props} />

    case 'google':
      return <Google className={cn('size-4 shrink-0', className)} {...props} />

    case 'gitlab':
      return <Gitlab className={cn('size-4 shrink-0', className)} {...props} />

    case 'posthog':
      return <Posthog className={cn('size-4 shrink-0', className)} {...props} />

    case 'x':
      return <X className={cn('size-4 shrink-0', className)} {...props} />

    case 'twilio':
      return <Twilio className={cn('size-4 shrink-0', className)} {...props} />

    case 'sentry':
      return <Sentry className={cn('size-4 shrink-0', className)} {...props} />

    case 'vercel':
      return <Vercel className={cn('size-4 shrink-0', className)} {...props} />

    case 'aws':
      return <AWS className={cn('size-4 shrink-0', className)} {...props} />

    case 'meta':
      return <Meta className={cn('size-4 shrink-0', className)} {...props} />

    case 'notion':
      return <Notion className={cn('size-4 shrink-0', className)} {...props} />

    case 'betterauth':
      return <BetterAuth className={cn('size-4 shrink-0', className)} {...props} />

    case 'auth0':
      return <Auth0 className={cn('size-4 shrink-0', className)} {...props} />

    case 'cloudflare':
      return <Cloudflare className={cn('size-4 shrink-0', className)} {...props} />

    case 'docker':
      return <Docker className={cn('size-4 shrink-0', className)} {...props} />

    case 'upstash':
      return <Upstash className={cn('size-4 shrink-0', className)} {...props} />

    case 'turso':
      return <Turso className={cn('size-4 shrink-0', className)} {...props} />

    case 'prisma':
      return <Prisma className={cn('size-4 shrink-0', className)} {...props} />

    case 'atlassian':
      return <Atlassian className={cn('size-4 shrink-0', className)} {...props} />

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
