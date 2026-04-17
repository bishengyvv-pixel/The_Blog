import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getAllPosts } from '../utils/posts'
import type { PostMeta } from '../utils/posts'
import { useSEO } from '../hooks/useSEO'

const MONTH_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

type MonthGroup = { month: string; monthEn: string; posts: PostMeta[] }
type YearGroup  = { year: string; months: MonthGroup[] }

function groupByYearMonth(posts: PostMeta[]): YearGroup[] {
  const yearMap = new Map<string, Map<number, PostMeta[]>>()

  posts.forEach(post => {
    const d   = new Date(post.date)
    const y   = `${d.getFullYear()}`
    const mon = d.getMonth()

    if (!yearMap.has(y)) yearMap.set(y, new Map())
    const mMap = yearMap.get(y)!
    if (!mMap.has(mon)) mMap.set(mon, [])
    mMap.get(mon)!.push(post)
  })

  return [...yearMap.entries()]
    .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
    .map(([year, mMap]) => ({
      year,
      months: [...mMap.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([mon, posts]) => ({
          month: `${mon + 1}月`,
          monthEn: MONTH_EN[mon],
          posts,
        })),
    }))
}

const allPosts = getAllPosts()
const groups   = groupByYearMonth(allPosts)
const total    = allPosts.length

const LABEL_W = 96
const GAP     = 24
const STICKY_TOP_PX = 72
const WATERMARK_H = 112

function PostRow({ post }: { post: PostMeta }) {
  const [hovered, setHovered] = useState(false)
  const day = String(new Date(post.date).getDate()).padStart(2, '0')

  return (
    <Link
      to={`/posts/${post.slug}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative',
        marginBottom: '2.5rem',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        position: 'absolute',
        left: '-5px',
        top: '0.25rem',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        border: `2px solid ${hovered ? 'var(--accent-color)' : 'var(--border-color)'}`,
        background: hovered ? 'var(--accent-color)' : 'var(--bg-primary)',
        transition: 'all 0.2s',
        zIndex: 1,
        flexShrink: 0,
      }} />

      <span style={{
        fontSize: '0.7rem',
        color: hovered ? 'var(--text-secondary)' : 'var(--text-tertiary)',
        paddingTop: '0.2rem',
        paddingLeft: '1rem',
        flexShrink: 0,
        minWidth: '2.25rem',
        fontVariantNumeric: 'tabular-nums',
        transition: 'color 0.2s',
      }}>
        {day}
      </span>

      <div style={{
        flex: 1,
        transform: hovered ? 'translateX(5px)' : 'none',
        transition: 'transform 0.2s',
      }}>
        <p style={{
          fontSize: '0.9375rem',
          fontWeight: 600,
          color: hovered ? 'var(--accent-color)' : 'var(--text-primary)',
          lineHeight: 1.5,
          marginBottom: '0.2rem',
          transition: 'color 0.2s',
        }}>
          {post.title}
        </p>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', letterSpacing: '0.03em' }}>
          {post.category}
          {post.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{ marginLeft: '0.5rem' }}>#{tag}</span>
          ))}
        </span>
      </div>
    </Link>
  )
}

function YearSection({ yearGroup }: { yearGroup: YearGroup }) {
  const sectionRef = useRef<HTMLElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function update() {
      const section = sectionRef.current
      const watermark = watermarkRef.current
      if (!section || !watermark) return

      const rect = section.getBoundingClientRect()

      const idealOffset = Math.max(0, STICKY_TOP_PX - rect.top)

      const maxOffset = section.offsetHeight - WATERMARK_H

      const clampedOffset = Math.min(idealOffset, Math.max(0, maxOffset))

      watermark.style.transform = `translateY(${clampedOffset}px)`
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section ref={sectionRef} style={{ position: 'relative', marginBottom: '4rem' }}>

      {/* Year watermark — JS-controlled translateY, clamped within section height */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <div ref={watermarkRef} style={{ willChange: 'transform' }}>
          <div style={{
            fontSize: '7rem',
            fontWeight: 900,
            color: 'var(--text-primary)',
            opacity: 0.035,
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.04em',
            position: 'relative',
            top: '-0.5rem',
            left: '-0.5rem',
          }}>
            {yearGroup.year}
          </div>
        </div>
      </div>

      {yearGroup.months.map(monthGroup => (
        <div
          key={monthGroup.month}
          style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}
        >
          <div style={{
            width: `${LABEL_W}px`,
            flexShrink: 0,
            paddingRight: `${GAP}px`,
            textAlign: 'right',
            paddingTop: '0.1rem',
          }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              lineHeight: 1.3,
            }}>
              {monthGroup.month}
            </div>
            <div style={{
              fontSize: '0.6rem',
              color: 'var(--text-tertiary)',
              fontStyle: 'italic',
              marginTop: '0.1rem',
              letterSpacing: '0.02em',
            }}>
              {monthGroup.monthEn}
            </div>
          </div>

          <div style={{
            flex: 1,
            borderLeft: '1px solid var(--border-color)',
            paddingLeft: '0',
            position: 'relative',
          }}>
            {monthGroup.posts.map(post => (
              <PostRow key={post.slug} post={post} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function Timeline() {
  useSEO('时间线', '按时间顺序浏览全部文章。')

  if (total === 0) {
    return (
      <div className="container py-8 md:py-12" style={{ maxWidth: '720px' }}>
        <h1 className="text-xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>时间线</h1>
        <div className="card text-center py-16" style={{ color: 'var(--text-tertiary)' }}>暂无文章</div>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12" style={{ maxWidth: '720px' }}>

      <div style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
          时间线
        </h1>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
          {total} 篇文章 · {groups.length} 年
        </span>
      </div>

      {groups.map(yearGroup => (
        <YearSection key={yearGroup.year} yearGroup={yearGroup} />
      ))}
    </div>
  )
}

export default Timeline