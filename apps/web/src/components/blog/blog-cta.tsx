import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

export interface BlogCtaProps {
  title?: string
  description?: string
  eyebrow?: string
  buttonText?: string
  className?: string
}

export function BlogCta({
  title = 'Start debugging your webhooks with Probe',
  description = 'Never guess what an API sent again. Real-time payload inspection, raw headers, and replay tools.',
  eyebrow = 'Developer Webhook Telemetry',
  buttonText = 'Start debugging for free',
  className,
}: BlogCtaProps) {
  return (
    <section className={cn('relative overflow-hidden border-t border-border px-6 py-16 text-center sm:px-10 sm:py-24', className)}>
      <div className="probe-hero-glow absolute inset-x-0 -top-20 -z-10 mx-auto h-72 max-w-2xl" />
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground text-sm sm:text-base">
        {description}
      </p>
      <div className="mt-8 flex justify-center">
        <Button
          data-umami-event-button-name="blog__cta__start-debugging"
          data-umami-link-event="Blog CTA start debugging clicked"
          render={<Link to="/dashboard" />}
          size="xl"
        >
          {buttonText}
          <ArrowRightIcon weight="bold" />
        </Button>
      </div>
    </section>
  )
}
