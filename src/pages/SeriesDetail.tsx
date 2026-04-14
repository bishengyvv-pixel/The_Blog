import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPostsBySeries } from '../utils/posts'
import type { PostMeta } from '../utils/posts'

const STORAGE_KEY_PREFIX = 'blog-series-progress-'

function SeriesDetail() {
  const { series } = useParams<{ series: string }>()
  const posts = useMemo(
    () => (series ? getPostsBySeries(series) : [] as PostMeta[]),
    [series]
  )

  const storageKey = `${STORAGE_KEY_PREFIX}${series}`

  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
    } catch {
      return new Set()
    }
  })

  // 同步到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...completed]))
    } catch { /* ignore */ }
  }, [completed, storageKey])

  function toggle(slug: string) {
    setCompleted(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  const progress = posts.length > 0 ? Math.round((completed.size / posts.length) * 100) : 0

  if (posts.length === 0) {
    return (
      <div className="container py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
          {series}
        </h1>
        <div className="card text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
          <p>暂无文章</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-3xl mx-auto">
      {/* 专题头 */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {series}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          共 {posts.length} 篇 · 建议按顺序阅读
        </p>

        {/* 进度条 */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              学习进度
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 600 }}>
              {completed.size} / {posts.length} · {progress}%
            </span>
          </div>
          <div style={{
            height: '6px',
            borderRadius: '9999px',
            background: 'var(--bg-tertiary)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--accent-color)',
              borderRadius: '9999px',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </header>

      {/* 文章列表 */}
      <div className="grid gap-3">
        {posts.map((post, index) => {
          const done = completed.has(post.slug)
          return (
            <div
              key={post.slug}
              className="card flex items-center gap-4"
              style={{
                opacity: done ? 0.75 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {/* 序号 */}
              <div
                style={{
                  flexShrink: 0,
                  width: '2.25rem',
                  height: '2.25rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  background: done ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                  color: done ? '#fff' : 'var(--text-tertiary)',
                  transition: 'background 0.25s, color 0.25s',
                }}
              >
                {done ? '✓' : index + 1}
              </div>

              {/* 标题 + 日期 */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/posts/${post.slug}`}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--text-primary)', display: 'block' }}
                >
                  {post.title}
                </Link>
                <time style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  {post.date}
                </time>
              </div>

              {/* 完成按钮 */}
              <button
                onClick={() => toggle(post.slug)}
                title={done ? '标记为未完成' : '标记为已完成'}
                style={{
                  flexShrink: 0,
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  border: '1px solid',
                  borderColor: done ? 'var(--accent-color)' : 'var(--border-color)',
                  background: 'transparent',
                  color: done ? 'var(--accent-color)' : 'var(--text-tertiary)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {done ? '已完成' : '标记完成'}
              </button>
            </div>
          )
        })}
      </div>

      {/* 全部完成提示 */}
      {progress === 100 && (
        <div
          className="card text-center mt-6 py-6"
          style={{ color: 'var(--accent-color)', fontWeight: 600 }}
        >
          恭喜！已完成本专题全部文章
        </div>
      )}
    </div>
  )
}

export default SeriesDetail
