import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type { Post, PostMeta } from '../types.js'

const POSTS_DIR = path.resolve(process.cwd(), '../posts')

/**
 * 获取所有文章文件列表
 */
export async function getPostFiles(): Promise<string[]> {
  try {
    const files = await fs.readdir(POSTS_DIR)
    return files.filter(f => f.endsWith('.md'))
  } catch {
    return []
  }
}

/**
 * 解析单篇文章
 */
export async function parsePost(filename: string): Promise<Post | null> {
  try {
    const filePath = path.join(POSTS_DIR, filename)
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)

    const slug = filename.replace(/\.md$/, '')

    return {
      meta: {
        slug,
        title: (data.title as string) || 'Untitled',
        date: (data.date as string) || new Date().toISOString(),
        category: (data.category as string) || '未分类',
        tags: (data.tags as string[]) || [],
        draft: (data.draft as boolean) || false,
        summary: data.summary as string | undefined,
        cover: data.cover as string | undefined,
        updatedAt: data.updatedAt as string | undefined,
        top: (data.top as boolean) || false,
        series: data.series as string | undefined,
        seriesOrder: data.seriesOrder as number | undefined,
      },
      content,
    }
  } catch {
    return null
  }
}

/**
 * 获取所有文章元数据列表
 */
export async function getAllPostsMeta(includeDrafts = false): Promise<PostMeta[]> {
  const files = await getPostFiles()
  const posts = await Promise.all(
    files.map(f => parsePost(f))
  )

  const validPosts = posts.filter((p): p is Post => p !== null)
  const filtered = includeDrafts
    ? validPosts
    : validPosts.filter(p => !p.meta.draft)

  return filtered
    .map(p => p.meta)
    .sort((a, b) => {
      if (a.top && !b.top) return -1
      if (!a.top && b.top) return 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}

/**
 * 获取单篇文章
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filename = `${slug}.md`
  const post = await parsePost(filename)
  if (post?.meta.draft) return null
  return post
}
