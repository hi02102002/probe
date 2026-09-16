import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const faqs = [
  {
    answer:
      'Probe is a developer platform for capturing, inspecting, and debugging incoming webhook requests and HTTP payloads in real time. It provides unique endpoint URLs to test webhooks from providers like Stripe, GitHub, Shopify, and Slack without requiring local tunnels or complex receiver setups.',
    question: 'What is Probe?',
  },
  {
    answer:
      'No CLI or local tunnel is required. Probe provisions cloud-hosted HTTPS endpoints instantly. You can paste your unique URL into any webhook provider and inspect incoming requests directly in your browser dashboard.',
    question: 'Do I need to install an SDK or run a local tunnel like ngrok?',
  },
  {
    answer:
      'Probe supports any provider that sends standard HTTP/HTTPS POST, PUT, PATCH, or GET requests. This includes Stripe, GitHub, Shopify, Slack, Twilio, Paddle, and custom services. Supported payload formats include JSON, XML, form-data, and raw text.',
    question: 'Which webhook providers and payload formats are supported?',
  },
  {
    answer:
      'Probe logs every delivery attempt with full request headers, HTTP status codes, query parameters, payload bodies, and arrival timestamps so you can verify provider signatures, debug schema mismatches, and trace retry sequences.',
    question: 'How does Probe help debug webhook delivery failures?',
  },
  {
    answer:
      'Webhook payloads are stored ephemerally to protect your privacy and automatically purged according to your plan retention window (e.g., 24 hours on the free tier). You can also permanently delete endpoints and purge request logs at any time.',
    question: 'How long are webhook payloads retained?',
  },
  {
    answer:
      'All traffic in transit is encrypted using TLS 1.3, and data at rest is encrypted with AES-256. Webhook data is strictly isolated to your authenticated account, and Probe never uses payload data for advertising or model training.',
    question: 'Is my webhook payload data secure and private?',
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 border-b border-border px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center sm:text-left">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground">Frequently asked questions</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">Everything you need to know about Probe.</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Answers to common questions about webhook inspection, privacy, and debugging workflows.</p>
        </div>
        <Accordion className="divide-y divide-border border-y border-border">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-base sm:text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-6 sm:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
