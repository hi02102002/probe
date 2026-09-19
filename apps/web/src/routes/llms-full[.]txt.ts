import { createFileRoute } from '@tanstack/react-router'
import { allBlogs } from 'content-collections'

const siteUrl = 'https://probe.monobase.io.vn'

export const Route = createFileRoute('/llms-full.txt')({
  server: {
    handlers: {
      GET: () => {
        const posts = allBlogs
          .filter(post => !post.draft)
          .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

        const guidesDetails = posts
          .map(
            (post, idx) => `### ${idx + 1}. ${post.title}
- **URL**: ${siteUrl}/blog/${post.slug}
- **Description**: ${post.description}
- **Tags**: ${post.tags.join(', ')}
- **Published**: ${post.publishedAt}
`,
          )
          .join('\n')

        const content = `# Probe — Comprehensive Developer & Platform Guide

> Real-time webhook inspection, capture, and debugging platform for developers. Capture, inspect, and analyze incoming HTTP requests with instant endpoints, payload inspection, and retry tracking.

## Overview

Probe is a developer-focused HTTP request inspection and webhook debugging platform. When building and testing integrations with external providers (such as Stripe, GitHub, Shopify, Slack, Twilio, or custom microservices), developers face recurring challenges:
1. Inability to directly route external webhooks to \`localhost\`.
2. Silent delivery drops without observability into status codes or response bodies.
3. Cryptographic signature mismatches (HMAC-SHA256) caused by JSON parser reformatting or clock drift.
4. Difficulties reproducing intermittent network timeouts or concurrency race conditions.

Probe solves these challenges by providing instant, persistent webhook ingestion endpoints, sub-millisecond request capture via Redis Pub/Sub, virtualized log exploration with syntax highlighting, and request replay capabilities.

---

## Core Platform Capabilities

### 1. Instant Webhook Endpoints
- Unique, secure HTTP ingestion URLs generated on demand without local tunnel setup.
- Accepts all standard HTTP methods: \`POST\`, \`GET\`, \`PUT\`, \`PATCH\`, \`DELETE\`, \`OPTIONS\`, \`HEAD\`.
- Captures raw, unmutated request bodies preserving exact UTF-8 byte sequences required for signature verification.
- Supports custom response codes (e.g. 200, 202, 400, 500) and mock response bodies.

### 2. Deep Request Inspection
- **Headers**: Complete representation of all incoming HTTP headers (including provider headers like \`Stripe-Signature\`, \`X-Hub-Signature-256\`, \`X-Shopify-Hmac-SHA256\`).
- **Body & Payloads**: Formatted JSON, XML, multipart, and raw text representations with byte-size accounting.
- **Query Parameters**: Key-value query string breakdown with URI decoding.
- **Timing & Performance**: Request timestamp, client IP, processing duration, and roundtrip delivery latency.

### 3. Request Filtering & Real-time Live Tail
- Virtualized list rendering capable of streaming thousands of requests without browser lag.
- Search and filter by HTTP method, status code, endpoint ID, or payload text.
- One-click copy for cURL commands, raw payloads, and signature headers.

---

## Authoritative Engineering Guides

${guidesDetails}
---

## Architecture & Technical Stack

- **Frontend**: TanStack Start (React 19), Vite, Tailwind CSS v4, Base UI, Nuqs, Phosphor Icons.
- **Backend**: Hono API (\`@hono/node-server\`), Redis Pub/Sub for real-time request streaming.
- **API / RPC**: oRPC type-safe procedures with client contracts.
- **Database**: PostgreSQL with Drizzle ORM v1 RC.
- **Authentication**: Better Auth 1.7 (Magic Link, OAuth).
- **Hosting & Infrastructure**: Deployed on Linux containers with edge caching and CDN distribution.

---

## Common Webhook Pitfalls and Solutions

### Pitfall 1: Altered Raw Body
- **Issue**: Standard framework body parsers re-serialize JSON or trim whitespace, invalidating the HMAC signature.
- **Solution**: Capture and verify raw bytes prior to JSON parsing or inspect the exact raw body received by Probe.

### Pitfall 2: Expired Timestamp Tolerances
- **Issue**: Providers like Stripe and Slack enforce 5-minute tolerances. Replaying an old captured request fails signature checks.
- **Solution**: Recompute the signature with current timestamp or disable timestamp tolerance checks in local test environments.

### Pitfall 3: Slow Webhook Handlers Triggering Retries
- **Issue**: Webhook providers expect an immediate 2xx response within 2-5 seconds. Synchronous processing causes timeouts and duplicate deliveries.
- **Solution**: Acknowledge receipt immediately with \`200 OK\` or \`202 Accepted\`, then enqueue the payload into a background job queue (e.g. BullMQ, Redis, or SQS).

---

## Key Facts & Entity Metadata

- **Organization**: Probe
- **Application Name**: Probe
- **Primary Domain**: ${siteUrl}
- **API Domain**: https://probe-api.monobase.io.vn
- **Primary Application Category**: DeveloperApplication / Webhook Debugger
- **Pricing**: Free tier with instant endpoint provisioning
- **Source Code**: https://github.com/hi02102002/probe
`

        return new Response(content, {
          headers: {
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            'Content-Type': 'text/plain; charset=UTF-8',
          },
        })
      },
    },
  },
})
