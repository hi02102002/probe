import { cn } from '@/lib/cn'

export function PageHeader(props: React.ComponentProps<'div'>): React.ReactElement {
  return (
    <div
      className={cn('flex flex-col gap-1', props.className)}
      {...props}
    />
  )
}

export function PageHeaderTitle(props: React.ComponentProps<'h1'>): React.ReactElement {
  return (
    <h1
      className={cn('text-2xl font-semibold tracking-tight', props.className)}
      {...props}
    />
  )
}

export function PageHeaderDescription(props: React.ComponentProps<'p'>): React.ReactElement {
  return (
    <p
      className={cn('text-base text-muted-foreground', props.className)}
      {...props}
    />
  )
}
