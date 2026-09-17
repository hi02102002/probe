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

### ⚠️ Critical Architecture: SPAs & Link Navigation

Umami's official script attaches a document click handler in the capture phase. When it encounters `data-umami-event` on an `<a>` tag:
```javascript
// Umami script internal behavior on <a> elements:
if ("A" === r.tagName && n) {
  return a || e.preventDefault(), t(r).then(() => {
    a || (("_top" === i ? u.location : o).href = n)
  })
}
```
**This causes a hard full-page browser reload** on every internal link click in Single-Page Applications (TanStack Router, Next.js, Remix, Vite SPA), breaking client-side navigation!

To maintain flawless SPA transitions without full-page reloads while tracking every link click in Umami:

| Target Element | Event Attribute | Button Name Attribute | Behavior |
|---|---|---|---|
| **Buttons** (`<button>`, `<Button>` without `render={<Link />}`) | `data-umami-event="..."` | `data-umami-event-button-name="screen__section__action"` | Tracked natively by Umami script without interfering. |
| **Links** (`<Link>`, `<a>`, `<Button render={<Link />} />`) | `data-umami-link-event="..."` | `data-umami-event-button-name="screen__section__action"` | Tracked via custom SPA listener (`useUmamiLinkTracker`) with zero `preventDefault()` and instant client-side routing. |

---

### The `useUmamiLinkTracker` Hook

Mount this hook once at the root layout (e.g. `__root.tsx` or main app shell):

```tsx
// src/hooks/use-umami-link-tracker.ts
import { useEffect } from 'react'

export function useUmamiLinkTracker() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const linkElement = target?.closest<HTMLElement>('[data-umami-link-event]')
      if (!linkElement) return

      const eventName = linkElement.getAttribute('data-umami-link-event')
      if (!eventName) return

      // Extract all data-umami-event-* attributes (e.g. button-name, slug, provider)
      const data: Record<string, string> = {}
      for (const attr of Array.from(linkElement.attributes)) {
        if (attr.name.startsWith('data-umami-event-')) {
          const key = attr.name.replace('data-umami-event-', '')
          data[key] = attr.value
        }
      }

      if (typeof window !== 'undefined' && window.umami?.track) {
        window.umami.track(eventName, Object.keys(data).length > 0 ? data : undefined)
      }
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => {
      document.removeEventListener('click', handleClick, { capture: true })
    }
  }, [])
}
```

---

### Requirement: Track Both Buttons AND Links
All interactive click targets — including buttons (`<Button>`, `<button>`), navigation links, breadcrumbs, card links, and text links (`<Link>`, `<a>`) — must carry:
1. `data-umami-event` (for buttons) OR `data-umami-link-event` (for links): Human-readable action name (max 50 chars).
2. `data-umami-event-button-name`: Screen-contextual identifier formatted in **`screen__section__action`** (all lowercase, separated by double underscores `__`, with sub-words in kebab-case).

### Core Attributes
- `data-umami-event`: Name of the event on `<button>` elements (max 50 characters).
- `data-umami-link-event`: Name of the event on `<Link>`, `<a>`, and `<Button render={<Link />} />` elements (max 50 characters).
- `data-umami-event-button-name`: Screen-contextual identifier formatted in **`screen__section__action`** (all lowercase, separated by double underscores `__`, with sub-words in kebab-case).
- `data-umami-event-*`: Additional custom properties (recorded as strings, e.g. `data-umami-event-slug="webhook-security"`).

### Screen Context Button & Link Naming Convention (`screen__section__action`)
Always use the lowercase `screen__section__action` format for `data-umami-event-button-name` so analytics clearly indicate which screen and component triggered the action:

```tsx
// Buttons use data-umami-event
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

// Links & Link Buttons use data-umami-link-event (prevents full page reload!)
<Link
  to="/terms"
  data-umami-link-event="Footer legal terms clicked"
  data-umami-event-button-name="home__footer__legal-terms"
>
  Terms of Service
</Link>

<Link
  to="/blog/$slug"
  params={{ slug: post.slug }}
  data-umami-link-event="Blog post card clicked"
  data-umami-event-button-name="blog__card__read-post"
  data-umami-event-slug={post.slug}
>
  {post.title}
</Link>

<Button
  data-umami-link-event="Hero start debugging clicked"
  data-umami-event-button-name="home__hero__start-debugging"
  render={<Link to="/dashboard" />}
>
  Go to Dashboard
</Button>

// Bad: using data-umami-event on a Link (causes full-page reload in SPA!)
<Link
  to="/dashboard"
  data-umami-event="Dashboard link clicked" // ❌ Reloads entire page!
  data-umami-event-button-name="home__nav__dashboard"
>
  Dashboard
</Link>

### Standard Event Matrix

| Action / Element | Tracking Attribute & Event Name | `data-umami-event-button-name` | Extra Attributes |
|---|---|---|---|
| Header Banner Link | `data-umami-link-event="Header banner clicked"` | `home__banner__link` | - |
| Header Nav Link | `data-umami-link-event="Header nav clicked"` | `home__nav__features` | `data-umami-event-nav="features"` |
| Header Sign In (Link) | `data-umami-link-event="Header sign in button clicked"` | `home__header__sign-in` | - |
| Header Dashboard (Link) | `data-umami-link-event="Header dashboard button clicked"` | `home__header__dashboard` | - |
| Hero CTA (Link) | `data-umami-link-event="Hero start debugging clicked"` | `home__hero__start-debugging` | - |
| Pricing CTA (Link) | `data-umami-link-event="Pricing start debugging clicked"` | `home__pricing__start-debugging` | - |
| Footer Nav Link | `data-umami-link-event="Footer nav features clicked"` | `home__footer__nav-features` | - |
| Footer Legal Link | `data-umami-link-event="Footer legal terms clicked"` | `home__footer__legal-terms` | - |
| Blog Card Link | `data-umami-link-event="Blog post card clicked"` | `blog__card__read-post` | `data-umami-event-slug="..."` |
| Blog Breadcrumb Link | `data-umami-link-event="Breadcrumb home clicked"` | `blog__breadcrumb__home` | - |
| Tab Navigation (Link) | `data-umami-link-event="Endpoint tab clicked"` | `dashboard__endpoint-tabs__overview` | - |
| Social Login (Button) | `data-umami-event="Social login clicked"` | `auth__login__continue-github` | `data-umami-event-provider="github"` |
| Form Submit (Button) | `data-umami-event="Magic link sign-in submitted"` | `auth__login__send-magic-link` | - |
| Copy Button (Button) | `data-umami-event="Copy to clipboard"` | `copy__clipboard__button` | - |
| Resource Creation (Button) | `data-umami-event="New endpoint button clicked"` | `dashboard__endpoints__new-endpoint` | - |
| Form Completion (Button) | `data-umami-event="Endpoint form submitted"` | `dashboard__endpoint-form__submit` | - |
| Test Trigger (Button) | `data-umami-event="Send test webhook request"` | `dashboard__test__send-request` | `data-umami-event-method="POST"` |

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
