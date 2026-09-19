import { ArrowRightIcon, BookOpenIcon, SparkleIcon } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { allBlogs } from 'content-collections'
import { useMemo, useState } from 'react'
import { BlogCta } from '@/components/blog/blog-cta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card'
import { dayjs } from '@/lib/dayjs'
import { generateAppSeo, getSiteBaseUrl } from '@/lib/seo'
import { HomeFooter } from '../../index/_components/home-footer'
import { HomeHeader } from '../../index/_components/home-header'

const allPosts = allBlogs
  .filter(post => !post.draft)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export const Route = createFileRoute('/(marketing)/blog/')({
  component: BlogIndexPage,
  head: () => {
    const baseUrl = getSiteBaseUrl()
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Blog',
          '@id': `${baseUrl}/blog#blog`,
          'description':
            'Practical guides, security architectures, and debugging checklists for capturing and troubleshooting webhook requests.',
          'name': 'Probe Webhook Engineering Blog',
          'publisher': {
            '@type': 'Organization',
            'logo': `${baseUrl}/logo.png`,
            'name': 'Probe',
            'url': baseUrl,
          },
          'url': `${baseUrl}/blog`,
        },
        {
          '@type': 'ItemList',
          '@id': `${baseUrl}/blog#itemlist`,
          'itemListElement': allPosts.map((post, index) => ({
            '@type': 'ListItem',
            'description': post.description,
            'name': post.title,
            'position': index + 1,
            'url': `${baseUrl}/blog/${post.slug}`,
          })),
          'name': 'Webhook Engineering Guides',
          'numberOfItems': allPosts.length,
        },
      ],
    }

    return generateAppSeo({
      description:
        'Practical guides, security architectures, and debugging checklists for capturing and troubleshooting webhook requests.',
      pathname: '/blog',
      scripts: [
        {
          children: JSON.stringify(structuredData),
          type: 'application/ld+json',
        },
      ],
      title: 'Webhook Engineering Blog | Probe',
    })
  },
})

function formatDate(value: string) {
  return dayjs(value).format('MMM D, YYYY')
}

function BlogIndexPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Collect all unique tags
  const tags = useMemo(() => {
    const set = new Set<string>()
    for (const p of allPosts) {
      for (const t of p.tags) {
        set.add(t)
      }
    }
    return Array.from(set).sort()
  }, [])

  const filteredPosts = useMemo(() => {
    if (!selectedTag)
      return allPosts
    return allPosts.filter(p => p.tags.includes(selectedTag))
  }, [selectedTag])

  const featuredPost = !selectedTag && allPosts.length > 0 ? allPosts[0] : null
  const regularPosts = featuredPost
    ? filteredPosts.filter(p => p.slug !== featuredPost.slug)
    : filteredPosts

  return (
    <div className="min-h-svh bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <HomeHeader />
      <main className="mx-auto max-w-6xl border-x border-border">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden border-b border-border px-4 pb-14 pt-20 text-center sm:px-8 sm:pb-20 sm:pt-28">
          <div className="probe-hero-glow absolute inset-x-0 -top-32 -z-10 mx-auto h-96 max-w-3xl" />
          <div className="mx-auto max-w-4xl">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 border border-border bg-card/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success shadow-[0_0_10px_var(--success)]" />
              Webhook Engineering &amp; Production Guides
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
              Webhook engineering,
              {' '}
              <span className="text-accent-foreground">without the guesswork.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-xl sm:leading-8">
              Practical checklists, cryptographic security guides, and architectural breakdowns for receiving, inspecting, and troubleshooting incoming webhooks.
            </p>
          </div>
        </section>

        {/* Tag Filters Bar */}
        <section className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/10 px-4 py-3 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              data-umami-event="Filter blog posts by tag"
              data-umami-event-button-name="blog__filter__all"
              data-umami-event-tag="all"
              className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                selectedTag === null
                  ? 'border-primary bg-primary text-primary-foreground font-semibold'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              All Articles (
              {allPosts.length}
              )
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                data-umami-event="Filter blog posts by tag"
                data-umami-event-button-name={`blog__filter__${tag.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                data-umami-event-tag={tag}
                className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedTag === tag
                    ? 'border-primary bg-primary text-primary-foreground font-semibold'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                #
                {tag}
              </button>
            ))}
          </div>
          <span className="hidden text-xs text-muted-foreground md:inline">
            Showing
            {' '}
            {filteredPosts.length}
            {' '}
            {filteredPosts.length === 1 ? 'article' : 'articles'}
          </span>
        </section>

        {/* Featured Post Spotlight (Composed with Card primitive) */}
        {featuredPost && (
          <section className="relative overflow-hidden border-b border-border bg-card/20 p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <SparkleIcon weight="fill" className="size-3.5 text-warning" />
                  <span className="font-semibold uppercase tracking-wider text-accent-foreground">Featured Guide</span>
                  <span>·</span>
                  <span>{formatDate(featuredPost.publishedAt)}</span>
                  <span>·</span>
                  <span>
                    {featuredPost.readingTime}
                    {' '}
                    min read
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: featuredPost.slug }}
                    className="hover:text-accent-foreground transition-colors"
                    data-umami-link-event="Featured blog post title clicked"
                    data-umami-event-button-name="blog__featured__read-title"
                    data-umami-event-slug={featuredPost.slug}
                  >
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="mt-4 text-pretty text-muted-foreground text-sm leading-relaxed sm:text-base">
                  {featuredPost.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {featuredPost.tags.map(tag => (
                    <Badge key={tag} variant="outline" size="sm" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-8">
                  <Button
                    data-umami-link-event="Featured blog post button clicked"
                    data-umami-event-button-name="blog__featured__read-button"
                    data-umami-event-slug={featuredPost.slug}
                    render={<Link to="/blog/$slug" params={{ slug: featuredPost.slug }} />}
                  >
                    Read featured guide
                    <ArrowRightIcon weight="bold" />
                  </Button>
                </div>
              </div>

              {/* Terminal Preview Card */}
              <Card className="relative overflow-hidden border-border bg-card shadow-lg shadow-background/50">
                <CardHeader className="flex h-9 flex-row items-center justify-between border-b border-border p-3 font-mono text-[10px] text-muted-foreground sm:text-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-success" />
                    <span>POST /hooks/ep_featured</span>
                  </div>
                  <Badge variant="success" size="sm" className="font-mono text-[10px]">
                    200 OK
                  </Badge>
                </CardHeader>
                <CardPanel className="p-0">
                  <div className="border-b border-border/50 bg-muted/20 p-3 font-mono text-[10px] sm:text-xs">
                    <div className="grid grid-cols-[6rem_1fr] gap-1 text-muted-foreground">
                      <span>content-type:</span>
                      <span className="text-foreground">application/json</span>
                      <span>x-signature:</span>
                      <span className="truncate text-foreground">t=1788,v1=982a1705...</span>
                      <span>received:</span>
                      <span className="text-foreground">{formatDate(featuredPost.publishedAt)}</span>
                    </div>
                  </div>
                  <div className="bg-code p-3.5 font-mono text-[11px] leading-5 text-muted-foreground">
                    <p className="text-chart-2">&#47;&#47; Key Takeaways</p>
                    <p className="text-foreground">1. Capture raw byte buffer before parsing JSON</p>
                    <p className="text-foreground">2. Validate timestamp freshness window</p>
                    <p className="text-foreground">3. Acknowledge within 3s to prevent retries</p>
                  </div>
                </CardPanel>
              </Card>
            </div>
          </section>
        )}

        {/* Regular Articles Grid (Composed with Card primitive) */}
        <section className="border-b border-border">
          <div className="grid md:grid-cols-2 gap-px bg-border">
            {regularPosts.map(post => (
              <Card
                key={post.slug}
                className="group relative flex flex-col justify-between rounded-none border-0 bg-background p-6 transition-colors hover:bg-card/70 sm:p-8"
              >
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-success/80" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span>
                      {post.readingTime}
                      {' '}
                      min read
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-xl font-semibold tracking-[-0.03em] text-foreground transition-colors group-hover:text-accent-foreground sm:text-2xl">
                    <Link
                      className="after:absolute after:inset-0 hover:underline"
                      data-umami-link-event="Blog post card clicked"
                      data-umami-event-button-name="blog__card__read-post"
                      data-umami-event-slug={post.slug}
                      params={{ slug: post.slug }}
                      to="/blog/$slug"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-3 text-pretty text-sm leading-6 text-muted-foreground">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardPanel className="p-0 pt-6">
                  <div className="flex items-center justify-between border-t border-border/60 pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-foreground transition-transform group-hover:translate-x-1">
                      Read guide
                      <ArrowRightIcon className="size-3" weight="bold" />
                    </span>
                  </div>
                </CardPanel>
              </Card>
            ))}
          </div>

          {regularPosts.length === 0 && !featuredPost && (
            <div className="py-20 text-center">
              <BookOpenIcon className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-muted-foreground text-sm">No articles found matching this filter.</p>
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                data-umami-event="Reset blog filter clicked"
                data-umami-event-button-name="blog__filter__reset"
                className="mt-4 text-xs font-medium text-accent-foreground underline"
              >
                Reset filter
              </button>
            </div>
          )}
        </section>

        {/* Bottom CTA Section */}
        <BlogCta
          eyebrow="Stop Guessing Payload Shapes"
          title="Debug your next webhook with Probe."
          description="Create an instant inspection endpoint. Inspect headers, query parameters, and raw JSON payloads in real time with zero CLI setup."
        />
      </main>
      <HomeFooter />
    </div>
  )
}
