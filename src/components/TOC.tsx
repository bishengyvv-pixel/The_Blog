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
      className="border-[3px] border-[var(--border-color)] p-4 bg-[var(--bg-secondary)] shadow-brutal-sm"
      style={{
        position: 'sticky',
        top: '5rem',
        maxHeight: 'calc(100vh - 8rem)',
        overflowY: 'auto',
      }}
    >
      <p style={{
        fontSize: '1rem',
        fontWeight: 900,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        borderBottom: '2px solid var(--border-color)',
        paddingBottom: '0.5rem',
      }}>
        目录
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {headings.map(h => (
          <li key={h.id} style={{ marginBottom: '0.5rem' }}>
            <a
              href={`#${h.id}`}
              onClick={e => {
                e.preventDefault()
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
              }}
              style={{
                display: 'block',
                padding: '0.4rem 0.75rem',
                paddingLeft: h.level === 3 ? '1.75rem' : '0.75rem',
                fontSize: h.level === 3 ? '0.875rem' : '1rem',
                color: activeId === h.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeId === h.id ? 900 : 700,
                textDecoration: 'none',
                transition: 'none',
                lineHeight: 1.4,
                backgroundColor: activeId === h.id ? 'var(--accent-color)' : 'transparent',
                border: activeId === h.id ? '2px solid var(--border-color)' : 'none',
                boxShadow: activeId === h.id ? '2px 2px 0 0 var(--border-color)' : 'none',
                transform: activeId === h.id ? 'translate(-2px, -2px)' : 'none',
              }}
              onMouseEnter={e => {
                if (activeId !== h.id) {
                  const target = e.currentTarget as HTMLElement
                  target.style.backgroundColor = 'var(--nav-hover-bg)'
                }
              }}
              onMouseLeave={e => {
                if (activeId !== h.id) {
                  const target = e.currentTarget as HTMLElement
                  target.style.backgroundColor = 'transparent'
                }
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
