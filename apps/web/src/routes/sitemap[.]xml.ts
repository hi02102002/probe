import { createFileRoute } from '@tanstack/react-router'
import { allBlogs } from 'content-collections'

const siteUrl = 'https://probe.monobase.io.vn'
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/terms', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.5', changefreq: 'monthly' },
] as const

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const blogRoutes = allBlogs
          .filter(post => !post.draft)
          .map(post => ({
            changefreq: 'monthly',
            lastmod: post.updatedAt ?? post.publishedAt,
            path: `/blog/${post.slug}`,
            priority: '0.7',
          }))
        const urls = [...staticRoutes, ...blogRoutes]
          .map(route => `\n  <url>\n    <loc>${siteUrl}${route.path}</loc>${'lastmod' in route ? `\n    <lastmod>${route.lastmod}</lastmod>` : ''}\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`)
          .join('')

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>\n`,
          { headers: { 'Content-Type': 'application/xml; charset=UTF-8' } },
        )
      },
    },
  },
})
