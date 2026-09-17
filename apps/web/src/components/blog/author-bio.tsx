import { cn } from '@/lib/cn'

export interface AuthorBioProps {
  author?: string
  description?: string
  verificationNote?: string
  className?: string
}

export function AuthorBio({
  author = 'Probe Engineering Team',
  description = 'Probe is a focused webhook debugging platform designed for engineering teams. We build telemetry and developer inspection tooling to eliminate integration guesswork.',
  verificationNote = 'All guides are regularly verified against Stripe, GitHub, Shopify, and RFC specifications.',
  className,
}: AuthorBioProps) {
  return (
    <footer className={cn('border-t border-border/80 pt-8', className)}>
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card">
          <img
            alt="Probe"
            className="size-6 object-contain"
            height={24}
            src="/app-mark.png"
            width={24}
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">{author}</h4>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
          {verificationNote && (
            <p className="mt-2 text-xs text-muted-foreground">
              {verificationNote}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
