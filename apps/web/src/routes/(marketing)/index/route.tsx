import { createFileRoute } from '@tanstack/react-router'
import { generateAppSeo } from '@/lib/seo'
import { ComparisonSection } from './_components/comparison-section'
import { DeliverySection } from './_components/delivery-section'
import { FeaturesSection } from './_components/features-section'
import { HeroSection } from './_components/hero-section'
import { HomeFooter } from './_components/home-footer'
import { HomeHeader } from './_components/home-header'
import { PricingSection } from './_components/pricing-section'

export const Route = createFileRoute('/(marketing)/')({
  component: HomePage,
  head: () => generateAppSeo({
    pathname: '/',
  }),
})

function HomePage() {
  return (
    <div className="min-h-svh bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <HomeHeader />
      <main className="mx-auto max-w-6xl border-x border-border">
        <HeroSection />
        <FeaturesSection />
        <DeliverySection />
        <ComparisonSection />
        <PricingSection />
      </main>
      <HomeFooter />
    </div>
  )
}
