export interface MockRequest {
  id: string
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  status: number
  timestamp: string
  durationMs: number
  sizeBytes: number
  ip: string
  headers: Record<string, string>
  queryParams: Record<string, string>
  body: Record<string, any> | string
  response: {
    status: number
    body: Record<string, any> | string
    headers: Record<string, string>
  }
}

export interface MockReplayLog {
  id: string
  originalRequestId: string
  targetUrl: string
  status: number
  durationMs: number
  timestamp: string
  method: string
  success: boolean
}

export interface MockEndpointDetail {
  id: string
  name: string
  token: string
  status: 'active' | 'paused' | 'inactive'
  createdAt: string
  lastRequestAt: string
  totalRequests: number
  successRate: number
  avgLatencyMs: number
  activeRulesCount: number
}

export const MOCK_ENDPOINT: MockEndpointDetail = {
  id: 'ept_9f82d8c17a8e4f1a9b2c3d4e5f6a7b8c',
  name: 'Stripe Payments Production',
  token: 'tok_live_89f1a23e4d5678',
  status: 'active',
  createdAt: '2026-08-15T08:30:00Z',
  lastRequestAt: '2026-09-02T22:45:12Z',
  totalRequests: 2845,
  successRate: 99.2,
  avgLatencyMs: 34,
  activeRulesCount: 2,
}

export const MOCK_REQUESTS: MockRequest[] = [
  {
    id: 'req_01J6A9B8C7D6E5F4A3B2C1D0E9',
    method: 'POST',
    path: '/webhook/stripe',
    status: 200,
    timestamp: '2026-09-02T22:48:10Z',
    durationMs: 32,
    sizeBytes: 1840,
    ip: '54.187.174.169',
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'user-agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
      'stripe-signature': 't=1788360490,v1=9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
      'x-request-id': 'req_live_stripe_994201',
      'accept-encoding': 'gzip, deflate, br',
    },
    queryParams: {
      source: 'checkout_session',
      livemode: 'true',
    },
    body: {
      id: 'evt_1P8s9X2eZvKYlo2C84jN9xKL',
      object: 'event',
      api_version: '2024-06-20',
      created: 1788360490,
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_3P8s9X2eZvKYlo2C1gH3jK9L',
          object: 'payment_intent',
          amount: 8900,
          amount_received: 8900,
          currency: 'usd',
          status: 'succeeded',
          customer: 'cus_Q9mK8jL2pX',
          payment_method: 'pm_1P8s8Y2eZvKYlo2C',
          receipt_email: 'alex.rivera@example.com',
        },
      },
      livemode: true,
      pending_webhooks: 1,
    },
    response: {
      status: 200,
      body: { received: true, acknowledged_at: '2026-09-02T22:48:10.032Z' },
      headers: {
        'content-type': 'application/json',
        'x-probe-response-time': '32ms',
      },
    },
  },
  {
    id: 'req_01J6A8Z9Y8X7W6V5U4T3S2R1Q0',
    method: 'POST',
    path: '/webhook/stripe',
    status: 502,
    timestamp: '2026-09-02T22:42:05Z',
    durationMs: 5012,
    sizeBytes: 1240,
    ip: '54.187.174.170',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
      'stripe-signature': 't=1788360125,v1=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
      'x-request-id': 'req_live_stripe_994198',
    },
    queryParams: {
      retry_count: '2',
    },
    body: {
      id: 'evt_1P8s7W2eZvKYlo2C3xY9z0AB',
      object: 'event',
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_1P8s7W2eZvKYlo2C',
          status: 'active',
          current_period_end: 1790952125,
          plan: {
            id: 'plan_pro_monthly',
            amount: 2900,
          },
        },
      },
    },
    response: {
      status: 502,
      body: { error: 'Bad Gateway: Upstream timeout after 5000ms' },
      headers: {
        'content-type': 'application/json',
        'x-probe-simulated-rule': 'latency-timeout',
      },
    },
  },
  {
    id: 'req_01J6A7X8W7V6U5T4S3R2Q1P0O9',
    method: 'POST',
    path: '/webhook/stripe',
    status: 200,
    timestamp: '2026-09-02T22:38:44Z',
    durationMs: 28,
    sizeBytes: 980,
    ip: '54.187.174.168',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
      'stripe-signature': 't=1788359924,v1=3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    },
    queryParams: {},
    body: {
      id: 'evt_1P8s5U2eZvKYlo2C4vW8x9YZ',
      object: 'event',
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          id: 'in_1P8s5U2eZvKYlo2C',
          amount_paid: 2900,
          customer_email: 'sarah.connor@example.com',
          paid: true,
        },
      },
    },
    response: {
      status: 200,
      body: { status: 'processed' },
      headers: { 'content-type': 'application/json' },
    },
  },
  {
    id: 'req_01J6A6W7V6U5T4S3R2Q1P0O9N8',
    method: 'GET',
    path: '/webhook/stripe/health',
    status: 200,
    timestamp: '2026-09-02T22:30:00Z',
    durationMs: 12,
    sizeBytes: 0,
    ip: '198.51.100.22',
    headers: {
      'user-agent': 'Probe-Monitor/2.0',
      'accept': '*/*',
    },
    queryParams: {
      check: 'ping',
    },
    body: '',
    response: {
      status: 200,
      body: { status: 'ok', uptime: '99.98%' },
      headers: { 'content-type': 'application/json' },
    },
  },
  {
    id: 'req_01J6A5V6U5T4S3R2Q1P0O9N8M7',
    method: 'POST',
    path: '/webhook/stripe',
    status: 400,
    timestamp: '2026-09-02T22:15:20Z',
    durationMs: 18,
    sizeBytes: 420,
    ip: '203.0.113.45',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'curl/8.4.0',
    },
    queryParams: {},
    body: {
      test: 'invalid_signature_test',
    },
    response: {
      status: 400,
      body: { error: 'Missing Stripe-Signature header' },
      headers: { 'content-type': 'application/json' },
    },
  },
]

export const MOCK_REPLAY_LOGS: MockReplayLog[] = [
  {
    id: 'rep_01J6B1A2B3C4D5E6F7A8B9C0D1',
    originalRequestId: 'req_01J6A9B8C7D6E5F4A3B2C1D0E9',
    targetUrl: 'https://api.myapp.dev/api/webhooks/stripe',
    status: 200,
    durationMs: 84,
    timestamp: '2026-09-02T22:49:00Z',
    method: 'POST',
    success: true,
  },
  {
    id: 'rep_01J6B0Z1Y2X3W4V5U6T7S8R9Q0',
    originalRequestId: 'req_01J6A8Z9Y8X7W6V5U4T3S2R1Q0',
    targetUrl: 'https://localhost:4000/webhooks',
    status: 500,
    durationMs: 120,
    timestamp: '2026-09-02T22:43:10Z',
    method: 'POST',
    success: false,
  },
  {
    id: 'rep_01J6AZ9Y8X7W6V5U4T3S2R1Q0P',
    originalRequestId: 'req_01J6A7X8W7V6U5T4S3R2Q1P0O9',
    targetUrl: 'https://api.staging.myapp.io/stripe',
    status: 200,
    durationMs: 65,
    timestamp: '2026-09-02T22:40:02Z',
    method: 'POST',
    success: true,
  },
]
