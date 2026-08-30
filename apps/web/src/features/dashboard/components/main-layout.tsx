import { DashboardHeader } from './header'

export function MainLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <div className="dark min-h-svh bg-background text-foreground">
      <DashboardHeader />
      <main>
        {children}
      </main>
    </div>
  )
}
