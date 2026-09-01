import { ComparisonSection } from './components/comparison-section'
import { DeliverySection } from './components/delivery-section'
import { FeaturesSection } from './components/features-section'
import { HeroSection } from './components/hero-section'
import { HomeFooter } from './components/home-footer'
import { HomeHeader } from './components/home-header'
import { PricingSection } from './components/pricing-section'

export function HomePage() {
  return (
    <div className="dark min-h-svh bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
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
