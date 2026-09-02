import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 border-b border-border px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground">Ready for the next webhook</p>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">Give every webhook a place to land.</h2>
        <p className="mt-5 max-w-2xl text-pretty leading-7 text-muted-foreground">Sign in, create your first endpoint, and replace guesswork with the request in front of you.</p>
        <Button className="mt-8" render={<Link to="/dashboard" />} size="xl">
          Start debugging
          <ArrowRightIcon weight="bold" />
        </Button>
      </div>
    </section>
  )
}
