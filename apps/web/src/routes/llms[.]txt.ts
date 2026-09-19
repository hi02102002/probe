import { createFileRoute } from '@tanstack/react-router'
import { allBlogs } from 'content-collections'

const siteUrl = 'https://probe.monobase.io.vn'

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () => {
        const posts = allBlogs
          .filter(post => !post.draft)
          .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

        const guidesList = posts
          .map(
            post =>
              `- [${post.title}](${siteUrl}/blog/${post.slug}): ${post.description}`,
          )
          .join('\n')

        const content = `# Probe

> Real-time webhook inspection, capture, and debugging platform for developers. Capture, inspect, and analyze incoming HTTP requests with instant endpoints and retry tracking.

## Docs

- [Probe Platform](${siteUrl}): Real-time developer platform to create webhook endpoints, inspect incoming HTTP payloads, and debug headers and query params.
- [Webhook Dashboard](${siteUrl}/dashboard): Interactive dashboard for managing webhook endpoints, filtering requests, and analyzing execution times and status codes.
- [Webhook Engineering Blog](${siteUrl}/blog): Practical engineering guides, security patterns, and testing architectures for production webhooks.

## Guides

${guidesList}

## Stack & Architecture

- [Frontend](${siteUrl}): TanStack Start (React 19), Vite, Tailwind CSS v4, Base UI, Phosphor Icons.
- [Backend](https://probe-api.monobase.io.vn): Hono API server, oRPC procedures, Redis Pub/Sub for sub-millisecond webhook ingestion.
- [Database & Auth](${siteUrl}): PostgreSQL, Drizzle ORM v1, Better Auth 1.7 (Magic Link, OAuth).

## Key Facts

- Product: Probe Webhook Debugger & HTTP Request Inspector
- Pricing: Free tier available with instant endpoint creation; no credit card required
- Core Use Cases: Stripe payment webhooks, third-party API callbacks, local dev tunneling, CI/CD webhook validation, HMAC signature debugging
- Supported HTTP Methods: POST, GET, PUT, PATCH, DELETE, OPTIONS, HEAD
- Official Website: ${siteUrl}

## Contact

- Website: ${siteUrl}
- Repository: https://github.com/hi02102002/probe

## Optional

- [Privacy Policy](${siteUrl}/privacy): Data privacy policies, retention limits for captured webhook payloads, and developer privacy standards.
- [Terms of Service](${siteUrl}/terms): Platform terms of service, acceptable use policies, and API rate limit guidelines.
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
