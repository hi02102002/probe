import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/features/legal'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/{-$locale}/(marketing)/privacy')({
  component: PrivacyPage,
  head: () => generateAppSeo({
    description: 'Privacy information for Probe.',
    pathname: '/privacy',
    title: 'Privacy Policy',
  }),
})

function PrivacyPage() {
  return (
    <LegalPage
      description="Starter privacy copy for the Probe application. Review and replace it before production use."
      lastUpdated="August 30, 2026"
      sections={[
        {
          title: '1. Account data',
          content: <p>The application may process account and authentication data required to sign users in and keep sessions secure.</p>,
        },
        {
          title: '2. Webhook data',
          content: <p>When webhook capture is implemented, define clearly what request data is stored, how long it is retained, and who can access it.</p>,
        },
        {
          title: '3. Security and retention',
          content: <p>Document the safeguards, retention periods, deletion controls, and subprocessors used by the production service.</p>,
        },
      ]}
      title="Privacy Policy"
    />
  )
}
