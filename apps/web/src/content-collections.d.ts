declare module 'content-collections' {
  import type { ComponentType } from 'react'

  export interface BlogPostHeading {
    id: string
    level: number
    title: string
  }

  export interface BlogPost {
    _meta: {
      path: string
      filePath: string
      directory: string
      fileName: string
      extension: string
    }
    title: string
    description: string
    slug: string
    publishedAt: string
    updatedAt?: string
    author: string
    tags: string[]
    draft: boolean
    cover?: string
    content?: string
    headings: BlogPostHeading[]
    readingTime: number
  }

  export const allBlogs: BlogPost[]

  export type BlogPostComponent = ComponentType<Record<string, unknown>>
}
