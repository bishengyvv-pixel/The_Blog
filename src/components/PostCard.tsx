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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`card p-5 transition-none ${hovered ? 'transform -translate-x-1 -translate-y-1 shadow-brutal-lg' : ''}`}
        style={{
          backgroundColor: hovered ? 'var(--accent-color)' : 'var(--bg-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>

          {/* 左：日期列 */}
          <div style={{
            flexShrink: 0,
            width: '72px',
            textAlign: 'center',
            border: '3px solid var(--border-color)',
            padding: '0.5rem',
            backgroundColor: 'var(--bg-primary)',
            boxShadow: '2px 2px 0 0 var(--border-color)',
          }}>
            <div style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              lineHeight: 1,
              color: 'var(--text-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {date.slice(8, 10)}
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--text-secondary)',
              marginTop: '0.25rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {date.slice(0, 7)}
            </div>
          </div>

          {/* 右：内容 */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* 分类 */}
            <span className="badge" style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
            }}>
              {category}
            </span>

            {/* 标题 */}
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              color: hovered ? 'var(--text-primary)' : 'var(--text-primary)',
              lineHeight: 1.4,
              marginBottom: '0.5rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {title}
            </h3>

            {/* 摘要 */}
            {summary && (
              <p style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '0.75rem',
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="badge"
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      backgroundColor: hovered ? 'var(--text-primary)' : 'var(--accent-tertiary)',
                      color: '#ffffff',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
