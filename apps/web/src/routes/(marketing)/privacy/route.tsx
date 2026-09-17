import { createFileRoute, Link } from '@tanstack/react-router'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/(marketing)/privacy')({
  component: PrivacyPage,
  head: () => generateAppSeo({
    description: 'Privacy Policy governing data collection, webhook payload handling, TLS 1.3 encryption, ephemeral retention, and data security at Probe.',
    pathname: '/privacy',
    title: 'Privacy Policy',
  }),
})

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article className="prose dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p>
          <strong>Last updated:</strong>
          {' '}
          September 2, 2026 &nbsp;|&nbsp;
          {' '}
          <strong>Effective date:</strong>
          {' '}
          September 2, 2026
        </p>
        <p>
          At Probe (&quot;Probe&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we recognize that webhook payloads often contain sensitive integration parameters, authorization credentials, and proprietary application data. We are deeply committed to developer privacy, practicing data minimization, and maintaining complete transparency.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, store, encrypt, expire, and protect your information when you access our website, create an account, generate endpoints, or use our debugging tools. Please review this document alongside our
          {' '}
          <Link
            data-umami-link-event="Privacy terms link clicked"
            data-umami-event-button-name="privacy__content__terms"
            to="/terms"
          >
            Terms of Service
          </Link>
          .
        </p>

        <h2>1. Overview &amp; Privacy Principles</h2>
        <p>
          Our engineering and operations are guided by foundational developer privacy principles:
        </p>
        <ul>
          <li>
            <strong>Data Minimization:</strong>
            {' '}
            We only collect data strictly necessary to deliver, maintain, and secure your webhook debugging workflows.
          </li>
          <li>
            <strong>Zero Data Monetization:</strong>
            {' '}
            We never sell, rent, or monetize your personal data or captured webhook payloads to advertisers or data brokers.
          </li>
          <li>
            <strong>Ephemeral Storage:</strong>
            {' '}
            Webhook request payloads are stored ephemerally and automatically purged according to your plan&apos;s retention window.
          </li>
          <li>
            <strong>Zero Model Training:</strong>
            {' '}
            We do not use your webhook payload contents to train public machine learning or AI models.
          </li>
          <li>
            <strong>Modern Cryptography:</strong>
            {' '}
            All data in transit is encrypted using TLS 1.3, and data at rest is encrypted using AES-256.
          </li>
        </ul>

        <h2>2. Information We Collect</h2>
        <p>
          We collect the following categories of information:
        </p>
        <h3>2.1 Account Information</h3>
        <p>
          When you register an account, we collect your name, email address, password hashes (secured via bcrypt/Argon2), OAuth provider identifiers (if signing in via GitHub or Google), and workspace preferences.
        </p>
        <h3>2.2 Webhook Request Payloads &amp; Metadata</h3>
        <p>
          When external services transmit HTTP requests to your Probe endpoints, our servers log: HTTP method, URL path, query parameters, arrival timestamp, HTTP request headers (including content-type and signatures), request body (JSON, XML, text, binary, or form-data), and sender IP address.
        </p>
        <h3>2.3 Usage &amp; Diagnostics Data</h3>
        <p>
          We gather aggregated telemetry regarding error rates, platform performance, browser user agents, and feature usage to maintain high platform availability.
        </p>
        <h3>2.4 Billing Information</h3>
        <p>
          For paid subscriptions, payment processing is handled directly by PCI-DSS certified payment processors. Probe does not store full credit card numbers or sensitive payment CVVs.
        </p>

        <h2>3. How We Use Information</h2>
        <p>
          We use collected information solely for legitimate operational purposes, including:
        </p>
        <ul>
          <li>Ingesting, parsing, formatting, displaying, and replaying webhook events in real time;</li>
          <li>Authenticating users and securing endpoints against unauthorized inspection;</li>
          <li>Providing technical support and diagnosing webhook delivery failures;</li>
          <li>Detecting, preventing, and mitigating abuse, spam, and denial-of-service attempts;</li>
          <li>Managing billing, subscriptions, and invoicing;</li>
          <li>Transmitting essential security alerts, maintenance notices, and system updates.</li>
        </ul>

        <h2>4. Webhook Payload Privacy &amp; Encryption</h2>
        <p>
          Captured payloads are isolated to your workspace and accessible only to authorized members of your team.
        </p>
        <p>
          We provide tools to redact sensitive authentication headers (such as
          {' '}
          <code>Authorization</code>
          ,
          {' '}
          <code>x-api-key</code>
          , or
          {' '}
          <code>stripe-signature</code>
          ) and payload fields before rendering. Probe personnel do not inspect user payload contents unless explicitly requested by you for debugging support or mandated by lawful court order.
        </p>

        <h2>5. Data Retention &amp; Automatic Expiration</h2>
        <p>
          Probe operates on an ephemeral lifecycle. Webhook payloads are retained only for the window designated by your plan (e.g., 24 hours on free tiers, or up to 30 days on paid tiers).
        </p>
        <p>
          When a payload reaches the end of its retention period, background workers permanently purge the data from our storage and caches. You can also trigger immediate manual purging of individual requests or complete endpoints at any time.
        </p>

        <h2>6. Data Security Measures</h2>
        <p>
          We implement comprehensive organizational and technical security controls:
        </p>
        <ul>
          <li>
            <strong>In Transit:</strong>
            {' '}
            Enforced TLS 1.3 encryption across all web interfaces, APIs, and webhook ingestion endpoints;
          </li>
          <li>
            <strong>At Rest:</strong>
            {' '}
            AES-256 encryption for database records, payload bodies, and backup archives;
          </li>
          <li>
            <strong>Access Controls:</strong>
            {' '}
            Role-based access controls, multi-factor authentication, and strict least-privilege administrative policies;
          </li>
          <li>
            <strong>Monitoring:</strong>
            {' '}
            Continuous security monitoring, vulnerability scans, and automated intrusion detection.
          </li>
        </ul>

        <h2>7. Information Sharing &amp; Third Parties</h2>
        <p>
          We do not sell or trade your data. We disclose information only under strict conditions:
        </p>
        <ul>
          <li>
            <strong>Infrastructure Subprocessors:</strong>
            {' '}
            Cloud hosting, database, and telemetry providers bound by data protection agreements;
          </li>
          <li>
            <strong>Payment Gateways:</strong>
            {' '}
            PCI-DSS certified payment processors handling subscriptions;
          </li>
          <li>
            <strong>Legal Obligations:</strong>
            {' '}
            When strictly required by applicable law, court order, or governmental subpoena;
          </li>
          <li>
            <strong>Security Protection:</strong>
            {' '}
            When necessary to protect platform integrity, user security, or legal rights.
          </li>
        </ul>

        <h2>8. International Data Transfers</h2>
        <p>
          Probe operates distributed infrastructure across multiple regions. When data is transferred internationally, we implement recognized safeguards, including Standard Contractual Clauses (SCCs), to protect personal data.
        </p>

        <h2>9. Your Rights &amp; Data Control</h2>
        <p>
          Under applicable data protection laws (such as GDPR and CCPA), you have the right to:
        </p>
        <ul>
          <li>Access, review, and request a copy of your personal data;</li>
          <li>Rectify inaccurate or outdated account information;</li>
          <li>Request complete erasure of your account, endpoints, and captured payloads;</li>
          <li>Export your data in standard JSON format;</li>
          <li>Object to or restrict specific data processing activities.</li>
        </ul>

        <h2>10. Cookies &amp; Local Storage</h2>
        <p>
          We use essential session cookies necessary for user authentication and anti-CSRF protection. We utilize browser Local Storage strictly for remembering user interface preferences (such as light/dark mode and sidebar states). We do not use third-party advertising cookies or cross-site tracking pixels.
        </p>

        <h2>11. Children&apos;s Privacy</h2>
        <p>
          Probe is designed for developers and professional software teams. The Platform is not directed to children under 16 years of age, and we do not knowingly collect personal data from minors.
        </p>

        <h2>12. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When modifications occur, we will update the &quot;Last updated&quot; date and notify users of material changes via email or dashboard announcements.
        </p>

        <h2>13. Contact &amp; Data Protection Inquiries</h2>
        <p>
          If you have any questions, privacy concerns, or wish to exercise your data protection rights, please contact our team:
        </p>
        <p>
          Probe Privacy &amp; Security Team
          <br />
          Website:
          {' '}
          <a href="https://probe.monobase.io.vn" rel="noreferrer" target="_blank">
            https://probe.monobase.io.vn
          </a>
        </p>
      </article>
    </main>
  )
}
