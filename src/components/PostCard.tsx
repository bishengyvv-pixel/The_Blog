import { Link } from 'react-router-dom'
import { useState } from 'react'

interface PostCardProps {
  title: string
  date: string
  category: string
  tags?: string[]
  summary?: string
  slug: string
}

function PostCard({ title, date, category, tags = [], summary, slug }: PostCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={`/posts/${slug}`}
      className="block"
      style={{ padding: '0.9rem 0.25rem', color: 'inherit' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* 左：日期列 */}
        <div style={{
          flexShrink: 0,
          width: '72px',
          textAlign: 'right',
          paddingTop: '0.1rem',
          paddingRight: '1.25rem',
          borderRight: `3px solid ${hovered ? 'var(--text-tertiary)' : 'var(--border-color)'}`,
          transition: 'border-color 0.2s',
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            lineHeight: 1,
            color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontVariantNumeric: 'tabular-nums',
            transition: 'color 0.2s',
          }}>
            {date.slice(8, 10)}
          </div>
          <div style={{
            fontSize: '0.625rem',
            color: 'var(--text-tertiary)',
            marginTop: '0.2rem',
            letterSpacing: '0.05em',
          }}>
            {date.slice(0, 7)}
          </div>
        </div>

        {/* 右：内容 */}
        <div style={{ flex: 1, minWidth: 0, paddingLeft: '1.5rem' }}>

          {/* 分类 */}
          <span style={{
            display: 'inline-block',
            fontSize: '0.65rem',
            fontWeight: 600,
            padding: '0.1rem 0.5rem',
            borderRadius: '4px',
            background: 'rgba(37,99,235,0.08)',
            color: 'var(--accent-color)',
            marginBottom: '0.35rem',
            letterSpacing: '0.05em',
          }}>
            {category}
          </span>

          {/* 标题 */}
          <h3 style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: hovered ? 'var(--accent-color)' : 'var(--text-primary)',
            lineHeight: 1.5,
            marginBottom: '0.3rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 0.2s',
          }}>
            {title}
          </h3>

          {/* 摘要 */}
          {summary && (
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              marginBottom: '0.5rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {summary}
            </p>
          )}

          {/* 标签胶囊 */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.68rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-tertiary)',
                    lineHeight: 1.6,
                    opacity: 0.8,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

        </div>
      </div>
    </Link>
  )
}

export default PostCard
