import { useMemo, useState } from 'react'
import PostCard from '../components/PostCard'
import { getAllPosts } from '../utils/posts'
import type { PostMeta } from '../utils/posts'
import { useSEO } from '../hooks/useSEO'

const PAGE_SIZE = 10

const allPosts: PostMeta[] = getAllPosts()

function PostList() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<{ type: 'category' | 'tag'; value: string } | null>(null)

  useSEO('文章', '浏览全部技术文章，支持按分类和标签筛选。')

  const filtered = useMemo(() => {
    if (!filter) return allPosts
    if (filter.type === 'category') return allPosts.filter(p => p.category === filter.value)
    return allPosts.filter(p => p.tags.some(t => t.toLowerCase() === filter.value.toLowerCase()))
  }, [filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // 分类 / 标签列表用于筛选器
  const categories = useMemo(() => [...new Set(allPosts.map(p => p.category))], [])
  const tags = useMemo(() => {
    const map = new Map<string, number>()
    allPosts.forEach(p => p.tags.forEach(t => map.set(t, (map.get(t) ?? 0) + 1)))
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name)
  }, [])

  function setFilterAndReset(f: typeof filter) {
    setFilter(f)
    setPage(1)
  }

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      {/* 页头 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          全部文章
          <span className="ml-3 text-base font-normal" style={{ color: 'var(--text-tertiary)' }}>
            共 {filtered.length} 篇
          </span>
        </h1>

        {filter && (
          <button
            onClick={() => setFilterAndReset(null)}
            className="badge"
            style={{ cursor: 'pointer', color: 'var(--accent-color)' }}
          >
            {filter.type === 'category' ? filter.value : `#${filter.value}`} ✕
          </button>
        )}
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterAndReset(
              filter?.type === 'category' && filter.value === cat ? null : { type: 'category', value: cat }
            )}
            className="badge"
            style={{
              cursor: 'pointer',
              background: filter?.type === 'category' && filter.value === cat
                ? 'var(--accent-color)' : 'var(--bg-tertiary)',
              color: filter?.type === 'category' && filter.value === cat
                ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 标签筛选 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilterAndReset(
              filter?.type === 'tag' && filter.value === tag ? null : { type: 'tag', value: tag }
            )}
            style={{
              cursor: 'pointer',
              fontSize: '0.8rem',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: filter?.type === 'tag' && filter.value === tag
                ? 'var(--accent-color)' : 'var(--border-color)',
              background: 'transparent',
              color: filter?.type === 'tag' && filter.value === tag
                ? 'var(--accent-color)' : 'var(--text-tertiary)',
            }}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* 文章列表 */}
      {paginated.length > 0 ? (
        <div className="grid gap-4">
          {paginated.map(post => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
          <p>暂无文章</p>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="btn btn-secondary"
            style={{ opacity: page === 1 ? 0.4 : 1 }}
          >
            ← 上一页
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="btn"
                style={{
                  minWidth: '2.25rem',
                  padding: '0.5rem',
                  background: p === page ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                  color: p === page ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="btn btn-secondary"
            style={{ opacity: page === totalPages ? 0.4 : 1 }}
          >
            下一页 →
          </button>
        </div>
      )}
    </div>
  )
}

export default PostList
