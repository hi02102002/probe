import { createFileRoute } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'
import { LegalPage } from '@/features/legal'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/{-$locale}/(marketing)/privacy')({
  component: PrivacyPage,
  head: () => generateAppSeo({
    description: 'Privacy Policy and data protection practices for Probe.',
    pathname: '/privacy',
    title: 'Privacy Policy',
  }),
})

function PrivacyPage() {
  const content = useIntlayer('legal')

  return (
    <LegalPage
      backToHomeLabel={content.backToHome.value}
      copyrightText={content.copyright.value}
      description={content.privacyDescription.value}
      eyebrow={content.eyebrow.value}
      lastUpdatedDate={content.lastUpdatedDate.value}
      lastUpdatedLabel={content.lastUpdatedLabel.value}
      privacyNavLabel={content.privacyNav.value}
      sections={[
        {
          content: <p>{content.privacySection1Content.value}</p>,
          title: content.privacySection1Title.value,
        },
        {
          content: <p>{content.privacySection2Content.value}</p>,
          title: content.privacySection2Title.value,
        },
        {
          content: <p>{content.privacySection3Content.value}</p>,
          title: content.privacySection3Title.value,
        },
        {
          content: <p>{content.privacySection4Content.value}</p>,
          title: content.privacySection4Title.value,
        },
        {
          content: <p>{content.privacySection5Content.value}</p>,
          title: content.privacySection5Title.value,
        },
        {
          content: <p>{content.privacySection6Content.value}</p>,
          title: content.privacySection6Title.value,
        },
      ]}
      termsNavLabel={content.termsNav.value}
      title={content.privacyTitle.value}
    />
  )
}
