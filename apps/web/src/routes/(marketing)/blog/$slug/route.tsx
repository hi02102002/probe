import type { ComponentType } from 'react'
import {
  ArrowLeftIcon,
  CheckIcon,
  CopyIcon,
} from '@phosphor-icons/react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { allBlogs } from 'content-collections'
import { useMemo, useState } from 'react'
import { AuthorBio } from '@/components/blog/author-bio'
import { BlogCta } from '@/components/blog/blog-cta'
import { BlogSidebar } from '@/components/blog/blog-sidebar'
import { mdxComponents } from '@/components/blog/mdx-components'
import { ProbeCallout } from '@/components/blog/probe-callout'
import { ReadingProgress } from '@/components/blog/reading-progress'
import { RelatedGuides } from '@/components/blog/related-guides'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { dayjs } from '@/lib/dayjs'
import { generateAppSeo, getSiteBaseUrl } from '@/lib/seo'
import { HomeFooter } from '../../index/_components/home-footer'
import { HomeHeader } from '../../index/_components/home-header'

interface BlogMdxModule {
  default: ComponentType<{ components?: typeof mdxComponents }>
}

const blogMdxModules = import.meta.glob<BlogMdxModule>(
  '/content/blog/*.mdx',
  { eager: true },
)

export const Route = createFileRoute('/(marketing)/blog/$slug')({
  component: BlogPostPage,
  loader: ({ params }) => {
    const post = allBlogs.find(
      candidate => candidate.slug === params.slug && !candidate.draft,
    )
    if (!post) {
      throw notFound()
    }
    return { post }
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post
    if (!post) {
      return generateAppSeo({
        pathname: '/blog',
        robots: { follow: false, index: false },
        title: 'Article not found',
      })
    }

    const baseUrl = getSiteBaseUrl()
    const canonicalUrl = `${baseUrl}/blog/${post.slug}`
    const published = new Date(`${post.publishedAt}T00:00:00Z`).toISOString()
    const modified = new Date(
      `${post.updatedAt ?? post.publishedAt}T00:00:00Z`,
    ).toISOString()
    const ogImageUrl = new URL('/og-image', baseUrl)
    ogImageUrl.searchParams.set('title', post.title)
    ogImageUrl.searchParams.set('subtitle', 'Probe Blog')
    if (post.description) {
      ogImageUrl.searchParams.set('description', post.description)
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': ['BlogPosting', 'TechArticle'],
      'about': post.tags.map(tag => ({ '@type': 'Thing', 'name': tag })),
      'articleSection': post.tags[0] ?? 'Engineering',
      'author': {
        '@type': 'Person',
        'name': post.author,
        'sameAs': [
          'https://www.linkedin.com/in/hoanghuydev0210/',
          'https://github.com/hi02102002',
        ],
        'url': baseUrl,
      },
      'dateModified': modified,
      'datePublished': published,
      'description': post.description,
      'headline': post.title,
      'image': ogImageUrl.toString(),
      'inLanguage': 'en-US',
      'isAccessibleForFree': true,
      'isPartOf': {
        '@type': 'Blog',
        '@id': `${baseUrl}/blog#blog`,
        'name': 'Probe Webhook Engineering Blog',
        'url': `${baseUrl}/blog`,
      },
      'keywords': post.tags.join(', '),
      'mainEntityOfPage': { '@type': 'WebPage', '@id': canonicalUrl },
      'publisher': {
        '@type': 'Organization',
        'logo': `${baseUrl}/logo.png`,
        'name': 'Probe',
        'url': baseUrl,
      },
      'url': canonicalUrl,
    }

    return generateAppSeo({
      description: post.description,
      pathname: `/blog/${post.slug}`,
      scripts: [
        { children: JSON.stringify(structuredData), type: 'application/ld+json' },
      ],
      title: `${post.title} | Probe Blog`,
    })
  },
})

function formatDate(value: string) {
  return dayjs(value).format('MMMM D, YYYY')
}

function BlogPostPage() {
  const { post } = Route.useLoaderData()
  const [copiedUrl, setCopiedUrl] = useState(false)

  // Related articles (matching tags or previous/next)
  const relatedPosts = useMemo(() => {
    return allBlogs
      .filter(p => p.slug !== post.slug && !p.draft)
      .slice(0, 2)
  }, [post.slug])

  const copyArticleLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setCopiedUrl(true)
        setTimeout(setCopiedUrl, 2000, false)
      }
    }
    catch {
      // ignore
    }
  }

  const Component = blogMdxModules[`/content/blog/${post._meta.fileName}`]?.default
  if (!Component) {
    throw new Error(`Missing compiled MDX module for ${post._meta.fileName}`)
  }

  return (
    <div className="min-h-svh bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <ReadingProgress />
      <HomeHeader />
      <main className="mx-auto max-w-6xl border-x border-border">
        {/* Navigation Breadcrumbs */}
        <div className="border-b border-border bg-muted/10 px-4 py-3 sm:px-8">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList className="text-xs text-muted-foreground">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    data-umami-event-button-name="blog__breadcrumb__home"
                    data-umami-link-event="Breadcrumb home clicked"
                    render={<Link to="/" />}
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    data-umami-event-button-name="blog__breadcrumb__blog"
                    data-umami-link-event="Breadcrumb blog clicked"
                    render={<Link to="/blog" />}
                  >
                    Blog
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[180px] truncate sm:max-w-xs text-foreground font-medium">
                    {post.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Link
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              data-umami-event-button-name="blog__detail__all-articles"
              data-umami-link-event="Back to blog list clicked"
              to="/blog"
            >
              <ArrowLeftIcon className="size-3.5" />
              <span>All articles</span>
            </Link>
          </div>
        </div>

        {/* Article Header Hero - Full Width of Main Column */}
        <header className="border-b border-border bg-card/20 p-6 sm:p-10">
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" size="sm" className="text-xs font-normal">
                  #
                  {tag}
                </Badge>
              ))}
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-muted-foreground text-xs font-medium">
                {post.readingTime}
                {' '}
                min read
              </span>
            </div>

            <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {post.description}
            </p>

            {/* Author & Telemetry Meta - Full Width Divider Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
                  <picture className="size-5">
                    <source srcSet="/app-mark.webp" type="image/webp" />
                    <img
                      alt="Probe"
                      className="size-5 object-contain"
                      height={20}
                      loading="eager"
                      src="/app-mark.png"
                      width={20}
                    />
                  </picture>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">
                    Published
                    {' '}
                    {formatDate(post.publishedAt)}
                    {post.updatedAt && post.updatedAt !== post.publishedAt && (
                      <span>
                        {' '}
                        · Updated
                        {formatDate(post.updatedAt)}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <Button
                data-umami-event="Blog share guide clicked"
                data-umami-event-button-name="blog__detail__share-guide"
                data-umami-event-slug={post.slug}
                onClick={copyArticleLink}
                size="xs"
                type="button"
                variant="outline"
              >
                {copiedUrl ? <CheckIcon className="text-success" /> : <CopyIcon />}
                {copiedUrl ? 'Link Copied' : 'Share Guide'}
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area with Sticky Sidebar */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:divide-x lg:divide-border">
          {/* Main Article Body */}
          <article className="min-w-0 px-6 py-12 sm:px-10 sm:py-16">
            <div className="prose prose-neutral max-w-3xl dark:prose-invert prose-headings:font-semibold prose-headings:tracking-[-0.025em] prose-headings:text-foreground prose-p:leading-7 prose-p:text-muted-foreground prose-a:font-medium prose-a:text-foreground prose-a:underline prose-a:decoration-border prose-a:underline-offset-4 hover:prose-a:decoration-foreground prose-code:rounded prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-xs prose-code:text-foreground prose-strong:text-foreground">
              <Component components={mdxComponents} />
            </div>

            {/* In-Article Probe Callout */}
            <ProbeCallout className="mt-12 max-w-3xl" />

            {/* Author Bio Section (E-E-A-T) */}
            <AuthorBio
              author={post.author}
              className="mt-16 max-w-3xl"
            />
          </article>

          {/* Sticky Sidebar on Desktop with Scrollspy TOC */}
          <BlogSidebar
            headings={post.headings}
            copiedUrl={copiedUrl}
            onCopyLink={copyArticleLink}
          />
        </div>

        {/* Related Articles Section */}
        <RelatedGuides posts={relatedPosts} />

        {/* Bottom CTA Banner */}
        <BlogCta />
      </main>
      <HomeFooter />
    </div>
  )
}
