---
name: umami
description: Best practices for implementing Umami analytics, declarative data-umami-event attributes on buttons and links, screen-contextual lowercase naming conventions (screen__section__action), user identification, and TypeScript types. Use when setting up Umami, tracking user interactions, buttons, links, forms, or user sessions.
---

# Umami Analytics Best Practices

Guidelines for implementing privacy-first analytics and event tracking using Umami in web applications.

---

## 1. Script Installation & Environment Control

### Production-Only Loading
Never track events or pageviews in local development or staging unless explicitly testing analytics.

In Vite / TanStack Start / Modern bundlers:

```tsx
<head>
  <meta charSet="utf-8" />
  {import.meta.env.PROD && (
    <script
      defer
      src="https://your-umami-domain.com/script.js"
      data-website-id="your-website-id"
    />
  )}
  <HeadContent />
</head>
```

In Next.js:

```tsx
{process.env.NODE_ENV === 'production' && (
  <Script
    defer
    src="https://your-umami-domain.com/script.js"
    data-website-id="your-website-id"
    strategy="afterInteractive"
  />
)}
```

### Script Placement Rules
- Place the script inside the root document `<head>` (e.g. `__root.tsx`, `layout.tsx`, or `index.html`).
- Ensure it is part of the persistent root shell so it is not re-mounted or re-downloaded on client route transitions.
- Umami automatically intercepts History API changes (`pushState`, `replaceState`) to track SPA route transitions.

---

## 2. Declarative Tracking with Data Attributes

Umami automatically tracks clicks on any element with `data-umami-event`.

### Requirement: Track Both Buttons AND Links
All interactive click targets — including buttons (`<Button>`, `<button>`), navigation links, breadcrumbs, card links, and text links (`<Link>`, `<a>`) — must carry both:
1. `data-umami-event`: Human-readable action name (max 50 chars).
2. `data-umami-event-button-name`: Screen-contextual identifier formatted in **`screen__section__action`** (all lowercase, separated by double underscores `__`, with sub-words in kebab-case).

### Core Attributes
- `data-umami-event`: Name of the event (max 50 characters).
- `data-umami-event-button-name`: Screen-contextual identifier formatted in **`screen__section__action`** (all lowercase, separated by double underscores `__`, with sub-words in kebab-case).
- `data-umami-event-*`: Additional custom properties (recorded as strings, e.g. `data-umami-event-slug="webhook-security"`).

### Screen Context Button & Link Naming Convention (`screen__section__action`)
Always use the lowercase `screen__section__action` format for `data-umami-event-button-name` so analytics clearly indicate which screen and component triggered the action:

```tsx
// Good: contextual, predictable lowercase screen__section__action on buttons
<Button
  data-umami-event="Hero start debugging clicked"
  data-umami-event-button-name="home__hero__start-debugging"
>
  Start debugging
</Button>

<Button
  data-umami-event="Social login clicked"
  data-umami-event-button-name="auth__login__continue-github"
  data-umami-event-provider="github"
>
  Continue with GitHub
</Button>

// Good: contextual, predictable lowercase screen__section__action on links
<Link
  to="/terms"
  data-umami-event="Footer legal terms clicked"
  data-umami-event-button-name="home__footer__legal-terms"
>
  Terms of Service
</Link>

<Link
  to="/blog/$slug"
  params={{ slug: post.slug }}
  data-umami-event="Blog post card clicked"
  data-umami-event-button-name="blog__card__read-post"
  data-umami-event-slug={post.slug}
>
  {post.title}
</Link>

<a
  href="/#features"
  data-umami-event="Header nav clicked"
  data-umami-event-button-name="home__nav__features"
  data-umami-event-nav="features"
>
  Inspect
</a>

// Bad: missing screen context or uppercase letters
<Button
  data-umami-event="Hero clicked"
  data-umami-event-button-name="Home__hero__start-debugging" // Do not use uppercase
>
```

### Standard Event Matrix

| Action / Element | `data-umami-event` | `data-umami-event-button-name` | Extra Attributes |
|---|---|---|---|
| Header Banner | `Header banner clicked` | `home__banner__link` | - |
| Header Nav Link | `Header nav clicked` | `home__nav__features` | `data-umami-event-nav="features"` |
| Header Sign In | `Header sign in button clicked` | `home__header__sign-in` | - |
| Header Dashboard | `Header dashboard button clicked` | `home__header__dashboard` | - |
| Hero CTA | `Hero start debugging clicked` | `home__hero__start-debugging` | - |
| Pricing CTA | `Pricing start debugging clicked` | `home__pricing__start-debugging` | - |
| Footer Nav Link | `Footer nav features clicked` | `home__footer__nav-features` | - |
| Footer Legal Link | `Footer legal terms clicked` | `home__footer__legal-terms` | - |
| Blog Card Link | `Blog post card clicked` | `blog__card__read-post` | `data-umami-event-slug="..."` |
| Blog Breadcrumb Link | `Breadcrumb home clicked` | `blog__breadcrumb__home` | - |
| Social Login | `Social login clicked` | `auth__login__continue-github` | `data-umami-event-provider="github"` |
| Form Submit | `Magic link sign-in submitted` | `auth__login__send-magic-link` | - |
| Copy Button | `Copy to clipboard` | `copy__clipboard__button` | - |
| Resource Creation | `New endpoint button clicked` | `dashboard__endpoints__new-endpoint` | - |
| Form Completion | `Endpoint form submitted` | `dashboard__endpoint-form__submit` | - |
| Test Trigger | `Send test webhook request` | `dashboard__test__send-request` | `data-umami-event-method="POST"` |
| Tab Navigation | `Endpoint tab clicked` | `dashboard__endpoint-tabs__overview` | - |

---

## 3. User Identification (`window.umami.identify`)

Link anonymous sessions to an authenticated user when a user signs in.

```ts
// Hook / Auth state listener
useEffect(() => {
  if (!userId) return

  if (typeof window !== 'undefined' && window.umami) {
    window.umami.identify(userId, {
      email: userEmail,
      name: userName,
    })
  }
}, [userId, userEmail, userName])
```

- **`userId`**: Stable unique identifier for the user.
- **Session Data**: Relevant profile traits (`email`, `name`, `plan`, `teamId`).
- After calling `identify()`, all subsequent pageviews and custom events in the session are associated with that user ID.

---

## 4. Programmatic Tracking (`window.umami.track`)

For interactions not triggered by a direct click (e.g. keyboard shortcuts, automated completions, API responses):

```ts
// 1. Simple event
window.umami?.track('webhook-received')

// 2. Event with structured payload (supports numbers, booleans, objects)
window.umami?.track('webhook-delivered', {
  endpointId: 'ep_123',
  statusCode: 200,
  latencyMs: 42,
  retryCount: 0,
})

// 3. Custom pageview
window.umami?.track({
  website: '54a92f58-5371-4b3a-8158-198fd1eb8bfe',
  url: '/dashboard/endpoints/new',
  title: 'Create Endpoint',
})
```

---

## 5. TypeScript Integration

Define ambient types in `src/types/umami.d.ts`:

```ts
export interface UmamiTracker {
  track: {
    (): void
    (payload: Record<string, unknown>): void
    (eventName: string, eventData?: Record<string, unknown>): void
    (customFn: (props: Record<string, unknown>) => Record<string, unknown>): void
  }
  identify: {
    (userId: string, sessionData?: Record<string, unknown>): void
    (sessionData: Record<string, unknown>): void
  }
}

declare global {
  interface Window {
    umami?: UmamiTracker
  }
}

export {}
```

Optional type-safe wrapper helper:

```ts
export function trackEvent(name: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(name, data)
  }
}
```

---

## 6. Limits & Performance Best Practices

- **Event Name**: Maximum 50 characters.
- **Strings**: Maximum 500 characters per property value.
- **Numbers**: Maximum precision of 4 decimal places.
- **Objects**: Maximum 50 properties per payload.
- **Data Attributes**: All `data-umami-event-*` values are sent as strings. Use `window.umami.track(name, { count: 10 })` if numerical or boolean types are required in analysis.
- **Adblock Resilience**: If using Umami Cloud or self-hosted, reverse-proxy the tracker script to avoid basic DNS blockers.
