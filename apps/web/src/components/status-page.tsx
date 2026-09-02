import type { ReactNode } from 'react'
import { Logo } from '@/components/logo'

export function StatusPage({
  actions,
  code,
  description,
  title,
}: {
  actions?: ReactNode
  code: string
  description: string
  title: string
}) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-xl">
        <Logo />
        <p className="mt-14 text-sm font-medium text-primary">{code}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">{description}</p>
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </main>
  )
}
