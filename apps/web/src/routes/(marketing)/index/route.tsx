import { createFileRoute } from '@tanstack/react-router'
import { generateAppSeo } from '@/lib/seo'
import { ComparisonSection } from './_components/comparison-section'
import { DeliverySection } from './_components/delivery-section'
import { FeaturesSection } from './_components/features-section'
import { HeroSection } from './_components/hero-section'
import { HomeFooter } from './_components/home-footer'
import { HomeHeader } from './_components/home-header'
import { PricingSection } from './_components/pricing-section'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://probe.monobase.io.vn/#website',
      'description':
        'Capture, inspect, and debug incoming webhook requests from a clean developer-focused dashboard.',
      'name': 'Probe',
      'url': 'https://probe.monobase.io.vn/',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://probe.monobase.io.vn/#software',
      'applicationCategory': 'DeveloperApplication',
      'description':
        'Capture, inspect, and debug incoming webhook requests from a clean developer-focused dashboard.',
      'name': 'Probe',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
      'operatingSystem': 'All',
      'url': 'https://probe.monobase.io.vn/',
    },
  ],
}

export const Route = createFileRoute('/(marketing)/')({
  component: HomePage,
  head: () =>
    generateAppSeo({
      pathname: '/',
      scripts: [
        {
          children: JSON.stringify(structuredData),
          type: 'application/ld+json',
        },
      ],
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
