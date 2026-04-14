export interface PostMeta {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  draft: boolean
  summary?: string
  cover?: string
  updatedAt?: string
  top?: boolean
  series?: string
  seriesOrder?: number
}

export interface Post {
  meta: PostMeta
  content: string
}

// Vite 构建时静态导入 posts 目录下所有 .md 文件（raw 文本）
const modules = import.meta.glob('/posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const yamlStr = match[1]
  const content = match[2]

  // 简单 YAML 解析（支持字符串、数字、布尔、数组）
  const data: Record<string, unknown> = {}
  const lines = yamlStr.split(/\r?\n/)
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) { i++; continue }

    const key = line.slice(0, colonIdx).trim()
    const rest = line.slice(colonIdx + 1).trim()

    if (rest.startsWith('[') && rest.endsWith(']')) {
      // 内联数组
      data[key] = rest
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else if (rest === '' || rest === null) {
      // 可能是多行数组 (- item)
      const items: string[] = []
      i++
      while (i < lines.length && lines[i].trimStart().startsWith('-')) {
        items.push(lines[i].replace(/^\s*-\s*/, '').trim().replace(/^["']|["']$/g, ''))
        i++
      }
      data[key] = items
      continue
    } else if (rest === 'true') {
      data[key] = true
    } else if (rest === 'false') {
      data[key] = false
    } else if (/^\d+$/.test(rest)) {
      data[key] = Number(rest)
    } else {
      data[key] = rest.replace(/^["']|["']$/g, '')
    }
    i++
  }

  return { data, content }
}

function buildPost(filePath: string, raw: string): Post {
  const slug = filePath.replace(/^\/posts\//, '').replace(/\.md$/, '')
  const { data, content } = parseFrontmatter(raw)

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
}

// 所有已解析的文章（含草稿）
const allPostsWithDrafts: Post[] = Object.entries(modules).map(([path, raw]) =>
  buildPost(path, raw)
)

export function getPostBySlug(slug: string): Post | null {
  return allPostsWithDrafts.find((p) => p.meta.slug === slug) ?? null
}

export function getAllPosts(options?: { includeDrafts?: boolean }): PostMeta[] {
  const posts = options?.includeDrafts
    ? allPostsWithDrafts.map((p) => p.meta)
    : allPostsWithDrafts.filter((p) => !p.meta.draft).map((p) => p.meta)

  return posts.sort((a, b) => {
    if (a.top && !b.top) return -1
    if (!a.top && b.top) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category)
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getPostsBySeries(series: string): PostMeta[] {
  return getAllPosts()
    .filter((post) => post.series === series)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0))
}

export function getAllCategories(): { name: string; count: number }[] {
  const posts = getAllPosts()
  const categories = new Map<string, number>()
  posts.forEach((post) => {
    categories.set(post.category, (categories.get(post.category) || 0) + 1)
  })
  return Array.from(categories.entries()).map(([name, count]) => ({ name, count }))
}

export function getAllTags(): { name: string; count: number }[] {
  const posts = getAllPosts()
  const tags = new Map<string, number>()
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tags.set(tag, (tags.get(tag) || 0) + 1)
    })
  })
  return Array.from(tags.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function getAllSeries(): { name: string; count: number }[] {
  const posts = getAllPosts()
  const series = new Map<string, number>()
  posts.forEach((post) => {
    if (post.series) {
      series.set(post.series, (series.get(post.series) || 0) + 1)
    }
  })
  return Array.from(series.entries()).map(([name, count]) => ({ name, count }))
}
