import { createFileRoute } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'
import { LegalPage } from '@/features/legal'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/{-$locale}/(marketing)/terms')({
  component: TermsPage,
  head: () => generateAppSeo({
    description: 'Terms of Service for Probe webhook debugging and request intelligence.',
    pathname: '/terms',
    title: 'Terms of Service',
  }),
})

function TermsPage() {
  const content = useIntlayer('legal')

  return (
    <LegalPage
      backToHomeLabel={content.backToHome.value}
      copyrightText={content.copyright.value}
      description={content.termsDescription.value}
      eyebrow={content.eyebrow.value}
      lastUpdatedDate={content.lastUpdatedDate.value}
      lastUpdatedLabel={content.lastUpdatedLabel.value}
      privacyNavLabel={content.privacyNav.value}
      sections={[
        {
          content: <p>{content.termsSection1Content.value}</p>,
          title: content.termsSection1Title.value,
        },
        {
          content: <p>{content.termsSection2Content.value}</p>,
          title: content.termsSection2Title.value,
        },
        {
          content: <p>{content.termsSection3Content.value}</p>,
          title: content.termsSection3Title.value,
        },
        {
          content: <p>{content.termsSection4Content.value}</p>,
          title: content.termsSection4Title.value,
        },
        {
          content: <p>{content.termsSection5Content.value}</p>,
          title: content.termsSection5Title.value,
        },
        {
          content: <p>{content.termsSection6Content.value}</p>,
          title: content.termsSection6Title.value,
        },
      ]}
      termsNavLabel={content.termsNav.value}
      title={content.termsTitle.value}
    />
  )
}
