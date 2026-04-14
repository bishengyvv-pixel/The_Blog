import { useEffect, useRef, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

interface TOCProps {
  content: string  // raw markdown
}

// 与 rehype-slug 相同的 id 生成规则
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')  // 保留中文、英文、数字、连字符
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function parseHeadings(markdown: string): TocItem[] {
  const lines = markdown.split('\n')
  const items: TocItem[] = []

  for (const line of lines) {
    const m2 = line.match(/^##\s+(.+)$/)
    const m3 = line.match(/^###\s+(.+)$/)
    if (m2) {
      const text = m2[1].replace(/[`*_]/g, '').trim()
      items.push({ id: slugify(text), text, level: 2 })
    } else if (m3) {
      const text = m3[1].replace(/[`*_]/g, '').trim()
      items.push({ id: slugify(text), text, level: 3 })
    }
  }
  return items
}

function TOC({ content }: TOCProps) {
  const headings = parseHeadings(content)
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    const targets = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[]

    observerRef.current = new IntersectionObserver(
      entries => {
        // 找到最靠近视口顶部且可见的标题
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    targets.forEach(el => observerRef.current!.observe(el))
    return () => observerRef.current?.disconnect()
  }, [content])  // eslint-disable-line react-hooks/exhaustive-deps

  if (headings.length === 0) return null

  return (
    <nav
      aria-label="文章目录"
      style={{
        position: 'sticky',
        top: '5rem',
        maxHeight: 'calc(100vh - 8rem)',
        overflowY: 'auto',
        paddingLeft: '1rem',
        borderLeft: '2px solid var(--border-color)',
      }}
    >
      <p style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)',
        marginBottom: '0.75rem',
      }}>
        目录
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {headings.map(h => (
          <li key={h.id} style={{ marginBottom: '0.25rem' }}>
            <a
              href={`#${h.id}`}
              onClick={e => {
                e.preventDefault()
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              style={{
                display: 'block',
                padding: '0.2rem 0',
                paddingLeft: h.level === 3 ? '1rem' : 0,
                fontSize: h.level === 3 ? '0.8rem' : '0.875rem',
                color: activeId === h.id ? 'var(--accent-color)' : 'var(--text-secondary)',
                fontWeight: activeId === h.id ? 600 : 400,
                textDecoration: 'none',
                transition: 'color 0.2s',
                lineHeight: 1.4,
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TOC
