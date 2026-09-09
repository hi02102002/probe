import { createFileRoute } from '@tanstack/react-router'
import { generateAppSeo } from '@/lib/seo'
import { ComparisonSection } from './_components/comparison-section'
import { DeliverySection } from './_components/delivery-section'
import { faqs, FaqSection } from './_components/faq-section'
import { FeaturesSection } from './_components/features-section'
import { HeroSection } from './_components/hero-section'
import { HomeFooter } from './_components/home-footer'
import { HomeHeader } from './_components/home-header'
import { PricingSection } from './_components/pricing-section'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://probe.monobase.io.vn/#organization',
      'logo': 'https://probe.monobase.io.vn/logo.png',
      'name': 'Probe',
      'url': 'https://probe.monobase.io.vn/',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://probe.monobase.io.vn/#website',
      'description':
        'Capture, inspect, and debug incoming webhook requests in real time. Inspect headers, payload bodies, and query parameters from a fast developer dashboard.',
      'name': 'Probe',
      'publisher': {
        '@id': 'https://probe.monobase.io.vn/#organization',
      },
      'url': 'https://probe.monobase.io.vn/',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://probe.monobase.io.vn/#software',
      'applicationCategory': 'DeveloperApplication',
      'author': {
        '@id': 'https://probe.monobase.io.vn/#organization',
      },
      'description':
        'Capture, inspect, and debug incoming webhook requests in real time. Inspect headers, payload bodies, and query parameters from a fast developer dashboard.',
      'featureList': [
        'Instant webhook endpoints',
        'Real-time header and payload inspection',
        'Request history and filtering',
        'Delivery and retry attempt tracking',
      ],
      'name': 'Probe',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
      'operatingSystem': 'All',
      'screenshot': 'https://probe.monobase.io.vn/og-image',
      'url': 'https://probe.monobase.io.vn/',
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://probe.monobase.io.vn/#faq',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer,
        },
        'name': faq.question,
      })),
    },
  ],
}

export const Route = createFileRoute('/(marketing)/')({
  component: HomePage,
  head: () =>
    generateAppSeo({
      description:
        'Capture, inspect, and debug incoming webhook requests in real time. Inspect headers, payload bodies, and query parameters from a fast developer dashboard.',
      pathname: '/',
      scripts: [
        {
          children: JSON.stringify(structuredData),
          type: 'application/ld+json',
        },
      ],
      title: 'Probe | Webhook Debugger & HTTP Request Inspector',
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
        <FaqSection />
        <PricingSection />
      </main>
      <HomeFooter />
    </div>
  )
}
