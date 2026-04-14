import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

interface PostMeta {
  title: string
  date: string
  category: string
  tags: string[]
  summary?: string
  slug: string
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const yamlStr = match[1]
  const content = match[2]
  const data: Record<string, unknown> = {}

  for (const line of yamlStr.split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim()

    if (!key) continue

    if (val === 'true') { data[key] = true; continue }
    if (val === 'false') { data[key] = false; continue }
    if (/^\d+$/.test(val)) { data[key] = parseInt(val); continue }

    // 数组：[a, b, c] 或 ["a", "b"]
    if (val.startsWith('[')) {
      const inner = val.slice(1, -1)
      data[key] = inner
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
      continue
    }

    data[key] = val.replace(/^["']|["']$/g, '')
  }

  return { data, content }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function rssPlugin(options: {
  siteUrl: string
  siteTitle: string
  siteDescription: string
  postsDir?: string
  maxItems?: number
} = {
  siteUrl: 'https://example.com',
  siteTitle: '技术博客',
  siteDescription: '个人技术博客，记录学习历程，沉淀技术知识。',
}): Plugin {
  const {
    siteUrl,
    siteTitle,
    siteDescription,
    postsDir = 'posts',
    maxItems = 20,
  } = options

  return {
    name: 'vite-plugin-rss',
    apply: 'build',

    closeBundle() {
      const postsPath = path.resolve(process.cwd(), postsDir)
      if (!fs.existsSync(postsPath)) return

      const files = fs.readdirSync(postsPath).filter(f => f.endsWith('.md'))

      const posts: PostMeta[] = []
      for (const file of files) {
        const raw = fs.readFileSync(path.join(postsPath, file), 'utf-8')
        const { data } = parseFrontmatter(raw)

        if (data.draft === true) continue

        const slug = file.replace(/\.md$/, '')
        posts.push({
          slug,
          title: String(data.title ?? slug),
          date: String(data.date ?? ''),
          category: String(data.category ?? ''),
          tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
          summary: data.summary ? String(data.summary) : undefined,
        })
      }

      // 按日期倒序，取最新 maxItems 篇
      posts.sort((a, b) => (a.date < b.date ? 1 : -1))
      const recent = posts.slice(0, maxItems)

      const buildDate = new Date().toUTCString()
      const items = recent.map(post => {
        const url = `${siteUrl}/posts/${post.slug}`
        const pubDate = post.date ? new Date(post.date).toUTCString() : buildDate
        const desc = post.summary
          ? escapeXml(post.summary)
          : `${escapeXml(post.title)} — 来自技术博客`
        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${desc}</description>
    </item>`
      }).join('')

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

      const outDir = path.resolve(process.cwd(), 'dist')
      fs.writeFileSync(path.join(outDir, 'rss.xml'), rss, 'utf-8')
      console.log(`\x1b[32m✓\x1b[0m rss.xml generated (${recent.length} items)`)
    },
  }
}
