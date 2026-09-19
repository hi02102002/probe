import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 border-b border-border px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">Catch the next webhook right now.</h2>
        <p className="mt-5 max-w-2xl text-pretty leading-7 text-muted-foreground">
          No sign-up wall. No binary to compile. Hit the button below, grab a fresh endpoint, paste it into your Stripe or GitHub developer console, and watch raw payloads stream into your browser in under 15 milliseconds.
        </p>
        <Button
          className="mt-8"
          data-umami-event-button-name="home__pricing__start-debugging"
          data-umami-link-event="Pricing start debugging clicked"
          render={<Link to="/dashboard" />}
          size="xl"
        >
          Start debugging
          <ArrowRightIcon weight="bold" />
        </Button>
      </div>
    </section>
  )
}
