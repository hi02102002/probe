import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const faqs = [
  {
    answer:
      'Probe is a dedicated HTTP request capture tool built for developers who integrate third-party APIs and webhooks. Instead of spinning up local tunnels, tailing noisy cloud logs, or deploying temporary catch-all microservices, you get a clean HTTPS endpoint that accepts incoming requests and renders their exact headers, raw body bytes, and metadata in your browser.',
    question: 'What is Probe?',
  },
  {
    answer:
      'No local daemon or binary is required. Every endpoint runs in the cloud with automatic TLS termination. You paste the URL directly into your provider\'s configuration—like the Stripe dashboard or GitHub webhook settings—and inspect the incoming requests from anywhere.',
    question: 'Do I need to install an SDK or run a local tunnel like ngrok?',
  },
  {
    answer:
      'Any service that can fire an HTTP or HTTPS request will work. We regularly test against Stripe, GitHub, Shopify, Slack, Twilio, Paddle, Linear, and custom internal microservices. Payloads can be JSON, URL-encoded forms, XML, multipart form-data, or plain text up to 10MB per request.',
    question: 'Which webhook providers and payload formats are supported?',
  },
  {
    answer:
      'When a webhook fails, you usually want to answer three questions: did the provider actually send it, did the cryptographic signature match, and did our endpoint return the right status code in time? Probe records the raw signature headers (such as Stripe-Signature or X-Hub-Signature-256), the exact arrival timestamp down to the millisecond, and every retry attempt so you can trace what broke.',
    question: 'How does Probe help debug webhook delivery failures?',
  },
  {
    answer:
      'Free tier endpoints retain captured requests on a rolling 24-hour window, after which they are permanently purged from storage. You can also manually delete individual requests or wipe an entire endpoint whenever you finish a debugging session.',
    question: 'How long are webhook payloads retained?',
  },
  {
    answer:
      'Yes. All traffic terminates over TLS 1.3, and payloads are stored with AES-256 encryption at rest. Each endpoint belongs strictly to your authenticated session. We never inspect your data, we do not train AI models on customer payloads, and we never share data with third parties.',
    question: 'Is my webhook payload data secure and private?',
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 border-b border-border px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">Everything you need to know about Probe.</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Technical architecture, encryption standards, payload retention schedules, and local debugging workflows.</p>
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
