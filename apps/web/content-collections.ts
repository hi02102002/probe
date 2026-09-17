import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { rehypeHighlightCodeBlocks } from '@tanstack/highlight/rehype'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'
import { highlighter } from './src/lib/highlighter'

const blog = defineCollection({
  name: 'blog',
  directory: 'content/blog',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    publishedAt: z.string().date(),
    updatedAt: z.string().date().optional(),
    author: z.string().default('Probe Team'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    content: z.string().optional(),
    cover: z.string().optional(),
  }),
  transform: async (document, context) => {
    // Compile MDX using remark-gfm (GFM tables/autolinks), rehype-slug (heading IDs), and rehypeHighlightCodeBlocks (@tanstack/highlight plugin)
    const body = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeHighlightCodeBlocks, { highlighter }],
      ],
    })

    const slug = document.slug ?? document._meta.fileName.replace(/\.mdx$/, '')
    const content = document.content ?? ''

    // Calculate reading time at build time (approx 220 words/minute)
    const wordCount = content.trim().split(/\s+/).length
    const readingTime = Math.max(2, Math.ceil(wordCount / 220))

    // Extract headings at build time for Table of Contents
    const headings: Array<{ id: string, level: number, title: string }> = []
    for (const line of content.split('\n')) {
      if (line.startsWith('## ')) {
        const title = line.slice(3).trim()
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        headings.push({ id, level: 2, title })
      }
      else if (line.startsWith('### ')) {
        const title = line.slice(4).trim()
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        headings.push({ id, level: 3, title })
      }
    }

    return {
      ...document,
      body,
      content,
      headings,
      readingTime,
      slug,
    }
  },
})

export default defineConfig({
  content: [blog],
})
