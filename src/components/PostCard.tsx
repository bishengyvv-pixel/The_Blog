import { Link } from 'react-router-dom'
import { prepare, layout } from '@chenglou/pretext'

interface PostCardProps {
  title: string
  date: string
  category: string
  tags?: string[]
  summary?: string
  slug: string
}

function computeSummaryMinHeight(): number {
  try {
    const font = '13px "Noto Serif SC", serif'
    const lineHeightPx = 20
    const sample = '这是一段摘要文字示例，用于 pretext 测量行高。The quick brown fox jumps.'
    const prepared = prepare(sample, font)
    layout(prepared, 600, lineHeightPx)
    return lineHeightPx * 2
  } catch {
    return 40
  }
}

const SUMMARY_MIN_HEIGHT = computeSummaryMinHeight()

function PostCard({ title, date, category, tags = [], summary, slug }: PostCardProps) {
  return (
    <Link
      to={`/posts/${slug}`}
      className="card block"
      style={{ padding: '0.875rem 1.25rem' }}
    >
      {/* 标题 */}
      <h3
        className="font-semibold mb-1 truncate"
        style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.5 }}
      >
        {title}
      </h3>

      {/* 摘要 */}
      <p
        className="text-sm line-clamp-2 mb-2"
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.8125rem',
          lineHeight: 1.6,
          minHeight: `${SUMMARY_MIN_HEIGHT}px`,
        }}
      >
        {summary ?? ''}
      </p>

      {/* 元信息：分类 + 日期 + 标签，全在一行 */}
      <div
        className="flex flex-wrap items-center gap-x-2 gap-y-1"
        style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}
      >
        <span className="badge" style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>
          {category}
        </span>
        <time dateTime={date}>{date}</time>
        {tags.slice(0, 3).map(tag => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
    </Link>
  )
}

export default PostCard
