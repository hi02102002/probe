import type { ReactNode } from 'react'
import { SparkleIcon } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/cn'

export interface KeyTakeawaysProps {
  children?: ReactNode
  className?: string
  title?: string
}

export function KeyTakeaways({
  children,
  className,
  title = 'Key Takeaways',
}: KeyTakeawaysProps) {
  return (
    <Alert
      variant="default"
      className={cn(
        'not-prose my-8 border-primary/25 bg-card/70 shadow-xs',
        className,
      )}
    >
      <SparkleIcon className="size-4 text-warning" weight="fill" />
      <AlertTitle className="text-xs font-semibold uppercase tracking-wider text-accent-foreground">
        {title}
      </AlertTitle>
      <AlertDescription className="text-sm leading-relaxed text-foreground [&>p]:m-0 [&>ul]:mt-3 [&>ul]:space-y-1.5 [&>ul]:pl-5 [&>ul]:list-disc [&>ul>li]:text-muted-foreground [&>ul>li]:leading-6">
        {children}
      </AlertDescription>
    </Alert>
  )
}
