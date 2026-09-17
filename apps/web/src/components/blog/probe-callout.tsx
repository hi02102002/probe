import { ArrowRightIcon, LightningIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/cn'

export interface ProbeCalloutProps {
  className?: string
  description?: string
  title?: string
}

export function ProbeCallout({
  className,
  description = 'Create a dedicated Probe endpoint to capture headers, verify raw byte payloads, and debug delivery failures before deploying to production.',
  title = 'Ready to inspect incoming webhooks in real time?',
}: ProbeCalloutProps) {
  return (
    <Card className={cn('not-prose my-10 border-border bg-card/60 p-5 shadow-xs sm:p-6', className)}>
      <CardHeader className="p-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
          <LightningIcon weight="fill" className="size-3.5" />
          <span>Probe Live Inspection</span>
        </div>
        <CardTitle className="mt-2 text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {title}
        </CardTitle>
        <CardDescription className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardPanel className="p-0 pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button render={<Link to="/dashboard" />} size="sm">
            Start debugging now
            <ArrowRightIcon weight="bold" />
          </Button>
          <span className="text-xs text-muted-foreground">
            Free tier · Instant setup · TLS 1.3
          </span>
        </div>
      </CardPanel>
    </Card>
  )
}
