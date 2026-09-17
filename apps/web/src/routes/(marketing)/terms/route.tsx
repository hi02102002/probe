import { createFileRoute, Link } from '@tanstack/react-router'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/(marketing)/terms')({
  component: TermsPage,
  head: () => generateAppSeo({
    description: 'Terms of Service governing the use of Probe webhook debugging platform, API ingestion services, and account usage policies.',
    pathname: '/terms',
    title: 'Terms of Service',
  }),
})

function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article className="prose dark:prose-invert max-w-none">
        <h1>Terms of Service</h1>
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
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Probe platform, website, API, webhook ingestion infrastructure, request replay tools, and related developer services provided under the Probe brand (&quot;Platform&quot;, &quot;Service&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
        </p>
        <p>
          By accessing the website, registering an account, generating an endpoint, or sending HTTP payloads to the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our
          {' '}
          <Link
            data-umami-event="Terms privacy link clicked"
            data-umami-event-button-name="terms__content__privacy"
            to="/privacy"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <h2>1. Definitions</h2>
        <p>
          In these Terms, the following terms shall have the specified meanings:
        </p>
        <ul>
          <li>
            <strong>&quot;User&quot;</strong>
            {' '}
            refers to any individual or organization accessing, registering, or using the Platform.
          </li>
          <li>
            <strong>&quot;Account&quot;</strong>
            {' '}
            means the authenticated account registered by a User to manage endpoints, review captured requests, configure rules, and utilize the Platform.
          </li>
          <li>
            <strong>&quot;Endpoint&quot;</strong>
            {' '}
            means a unique HTTP/HTTPS ingestion URL provisioned on the Platform to receive, inspect, log, and replay incoming HTTP requests and webhook payloads.
          </li>
          <li>
            <strong>&quot;Webhook Payload&quot;</strong>
            {' '}
            encompasses all data, HTTP headers, query parameters, request bodies (JSON, XML, binary, or form-data), client IP addresses, and metadata received by an Endpoint.
          </li>
          <li>
            <strong>&quot;Customer Data&quot;</strong>
            {' '}
            means all configurations, credentials, project definitions, and Webhook Payloads processed or stored on behalf of the User.
          </li>
          <li>
            <strong>&quot;Subscription Plan&quot;</strong>
            {' '}
            refers to any tier of service (free or paid) defining usage quotas, retention duration, team collaboration seats, and feature availability.
          </li>
        </ul>

        <h2>2. Scope of Probe Services</h2>
        <p>
          Probe provides a specialized developer platform for capturing, inspecting, filtering, and debugging webhook events and HTTP traffic. Depending on your active configuration and plan, the Platform provides:
        </p>
        <ul>
          <li>Instant provisioning of unique HTTP/HTTPS endpoints for webhook ingestion;</li>
          <li>Real-time inspection and decoding of headers, query parameters, and payload bodies;</li>
          <li>Payload schema formatting, validation, and syntax highlighting;</li>
          <li>Customizable HTTP response simulation and status code mocking;</li>
          <li>Request replay and tunneling to local or remote development environments;</li>
          <li>Rule-based event filtering, conditional forwarding, and delivery validation;</li>
          <li>REST API and CLI interfaces for automated CI/CD workflows.</li>
        </ul>
        <p>
          Unless explicitly agreed upon in a written enterprise agreement, Probe operates as a developer inspection and testing utility. The Service is not intended as a permanent primary database or permanent regulatory audit archive. Users remain responsible for maintaining independent production data storage and implementing appropriate retry mechanisms.
        </p>

        <h2>3. Eligibility &amp; Account Security</h2>
        <p>
          To use the Platform, you must have the legal capacity to enter into binding contracts. When registering an Account, you agree to provide accurate and complete information and keep it updated.
        </p>
        <ul>
          <li>You are responsible for maintaining the confidentiality of your authentication credentials, session tokens, and API access keys;</li>
          <li>You are solely liable for all actions and data transmissions executed under your Account or via your generated Endpoint URLs;</li>
          <li>You must immediately notify Probe if you suspect unauthorized access or compromise of your Account or tokens;</li>
          <li>You may not transfer, sell, or lease your Account to any third party without our prior written authorization.</li>
        </ul>

        <h2>4. Webhook Ingestion &amp; Customer Data</h2>
        <p>
          When an Endpoint URL is created, our servers capture and process incoming HTTP requests sent to that address. All data in transit is encrypted using modern cryptographic protocols (TLS 1.3).
        </p>
        <p>
          You retain all ownership, title, and intellectual property rights in and to your Webhook Payloads and Customer Data. You grant Probe a worldwide, non-exclusive, royalty-free license to ingest, store, parse, format, display, and replay such data strictly as required to operate and provide the Service to you.
        </p>
        <p>
          You are encouraged to use Probe&apos;s header redaction and masking tools when handling webhooks with sensitive credentials (e.g., live banking tokens or payment provider secret keys).
        </p>

        <h2>5. Acceptable Use Policy &amp; Prohibited Conduct</h2>
        <p>
          You agree to use the Platform strictly in compliance with all applicable laws and regulations. You shall not directly or indirectly:
        </p>
        <ul>
          <li>Ingest, store, or transmit malicious software, viruses, exploits, or harmful payloads;</li>
          <li>Intercept or monitor HTTP traffic belonging to third parties without authorization;</li>
          <li>Execute denial-of-service (DoS/DDoS) attacks, flood attacks, or traffic bombing against Probe or any replay target;</li>
          <li>Use the Service for unauthorized spamming, phishing, fraud, or identity theft;</li>
          <li>Attempt to bypass rate limits, access controls, or security barriers;</li>
          <li>Decompile, reverse engineer, or extract source code from proprietary components of the Platform;</li>
          <li>Harvest or scrape data from other users, endpoints, or platform assets;</li>
          <li>Resell, sublicense, or repackage Probe services as a competing commercial product without prior written consent.</li>
        </ul>

        <h2>6. Intellectual Property Rights</h2>
        <p>
          The Platform, including its software code, algorithms, user interfaces, documentation, visual design, and trademarks, is and remains the exclusive property of Probe and its licensors.
        </p>
        <p>
          Subject to your compliance with these Terms, Probe grants you a limited, revocable, non-exclusive, non-transferable license to access and utilize the Platform for software testing and debugging purposes.
        </p>

        <h2>7. Automated Access &amp; Rate Limiting</h2>
        <p>
          Probe implements operational quotas and rate limits regarding request volume, payload size, concurrent connections, and query rates to maintain infrastructure stability and fair resource usage.
        </p>
        <p>
          Probe reserves the right to throttle, drop, or reject incoming requests that exceed plan thresholds or exhibit anomalous traffic spikes indicative of system abuse.
        </p>

        <h2>8. Paid Subscriptions &amp; Billing</h2>
        <p>
          Certain premium features, expanded storage quotas, and extended retention windows are available via paid Subscription Plans. All subscription pricing is clearly presented prior to purchase and billed on a recurring monthly or annual basis.
        </p>
        <p>
          You may cancel your subscription at any time via your account settings. Cancellation takes effect at the conclusion of the active billing cycle. Except where mandated by applicable consumer protection laws, fees paid are non-refundable.
        </p>

        <h2>9. Third-Party Integrations &amp; Webhook Sources</h2>
        <p>
          The Platform integrates with various third-party services that transmit webhooks (such as Stripe, GitHub, Shopify, and Slack). Probe is an independent developer platform and is not affiliated with, endorsed by, or responsible for third-party service uptime or payload formatting changes.
        </p>

        <h2>10. Data Retention &amp; Automatic Expiration</h2>
        <p>
          Captured webhook payloads are stored ephemerally and automatically purged based on the retention duration of your active plan (e.g., 24 hours on free tiers, or up to 30 days on paid tiers).
        </p>
        <p>
          Users can manually delete endpoints and purge request histories at any time. When an endpoint or account is deleted, all corresponding payload data is permanently purged from active storage.
        </p>

        <h2>11. Service Availability &amp; Modifications</h2>
        <p>
          We continually enhance the Platform and reserve the right to modify, update, or discontinue features with reasonable notice. Periodic maintenance windows may cause temporary service interruptions, which we endeavor to schedule during low-traffic periods with prior notice.
        </p>

        <h2>12. Suspension &amp; Termination</h2>
        <p>
          Probe may suspend or terminate your access to the Platform immediately if you violate these Terms, if your endpoint traffic poses a security threat, or upon valid legal directives. You may terminate your account at any time by deleting your account through settings.
        </p>

        <h2>13. Disclaimer of Warranties</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.
        </p>

        <h2>14. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL PROBE BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF PROFITS, LOSS OF DATA, OR BUSINESS INTERRUPTION). PROBE&apos;S AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY YOU TO PROBE IN THE PRECEDING TWELVE (12) MONTHS OR $50.00 USD, WHICHEVER IS GREATER.
        </p>

        <h2>15. Dispute Resolution &amp; Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with applicable laws. The parties agree to attempt informal resolution in good faith before initiating formal legal proceedings.
        </p>

        <h2>16. Amendments to Terms</h2>
        <p>
          We may revise these Terms periodically. When changes occur, we will update the &quot;Last updated&quot; date and notify users of material changes via email or dashboard announcements. Continued use of the Platform after updates constitutes acceptance of the modified Terms.
        </p>

        <h2>17. Contact Information</h2>
        <p>
          If you have any questions or feedback regarding these Terms of Service, please contact us:
        </p>
        <p>
          Probe Developer Platform
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
