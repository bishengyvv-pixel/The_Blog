import { useMemo, useState, useEffect } from 'react'
import CategorySection from '../components/CategorySection'
import PostCard from '../components/PostCard'
import { fetchPosts } from '../utils/api'
import type { PostMeta } from '../utils/posts'
import { useSEO } from '../hooks/useSEO'

const PAGE_SIZE = 10

function PostList() {
  const [allPosts, setAllPosts] = useState<PostMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<{ type: 'category' | 'tag'; value: string } | null>(null)
  const [search, setSearch] = useState('')

  useSEO('文章', '浏览全部技术文章，支持按分类和标签筛选。')

  useEffect(() => {
    fetchPosts()
      .then(posts => {
        setAllPosts(posts)
        setIsLoading(false)
      })
      .catch(() => {
        setAllPosts([])
        setIsLoading(false)
      })
  }, [])

  // 计算标签
  const allTags = useMemo(() => {
    const tagMap = new Map<string, number>()
    allPosts.forEach(post => {
      post.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    })
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [allPosts])

  const filtered = useMemo(() => {
    let result = allPosts
    if (filter) {
      if (filter.type === 'category') result = result.filter(p => p.category === filter.value)
      else result = result.filter(p => p.tags.some(t => t.toLowerCase() === filter.value.toLowerCase()))
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return result
  }, [allPosts, filter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function setFilterAndReset(f: typeof filter) {
    setFilter(f)
    setPage(1)
  }

  function handleSearch(v: string) {
    setSearch(v)
    setPage(1)
  }

  function handleTagClick(tag: string) {
    const active = filter?.type === 'tag' && filter.value === tag
    setFilterAndReset(active ? null : { type: 'tag', value: tag })
  }

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="card text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
            <p>加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex gap-10 items-start">

        {/* 左：文章列表 */}
        <main className="flex-[7] min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                全部文章
              </h1>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                {filtered.length} 篇
              </span>
            </div>
            {filter && (
              <button
                onClick={() => setFilterAndReset(null)}
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--accent-color)',
                  background: 'transparent',
                  border: '1px solid var(--accent-color)',
                  borderRadius: '9999px',
                  padding: '0.1rem 0.6rem',
                  cursor: 'pointer',
                }}
              >
                {filter.type === 'category' ? filter.value : `#${filter.value}`} ✕
              </button>
            )}
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '1.25rem' }} />
          {paginated.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {paginated.map(post => (
                <PostCard key={post.slug} {...post} />
              ))}
            </div>
          ) : (
            <div className="card text-center" style={{ padding: '4rem 2rem', color: 'var(--text-tertiary)' }}>
              {allPosts.length === 0 ? '暂无文章' : '没有找到符合条件的文章'}
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="btn btn-secondary"
                style={{ opacity: page === 1 ? 0.4 : 1 }}
              >
                ← 上一页
              </button>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
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
        </main>

        {/* 右：侧边栏 */}
        <aside className="hidden lg:flex flex-col gap-6 flex-[3] min-w-0 sticky top-20" style={{ maxHeight: 'calc(100vh - 7rem)', overflowY: 'auto' }}>

          {/* 搜索 */}
          <section>
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}
            >
              搜索
            </h3>
            <input
              type="text"
              placeholder="标题 / 摘要 / 标签…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.45rem 0.7rem',
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </section>

          <CategorySection
            variant="button"
            iconSize={14}
            activeCategory={filter?.type === 'category' ? filter.value : null}
            onCategorySelect={(category) =>
              setFilterAndReset(category ? { type: 'category', value: category } : null)
            }
          />

          {/* 标签云 — 首页同款 badge */}
          {allTags.length > 0 && (
            <section>
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}
              >
                标签
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map(tag => {
                  const active = filter?.type === 'tag' && filter.value === tag.name
                  return (
                    <button
                      key={tag.name}
                      onClick={() => handleTagClick(tag.name)}
                      className="badge"
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.55rem',
                        cursor: 'pointer',
                        background: active ? 'var(--accent-color)' : undefined,
                        color: active ? '#fff' : undefined,
                      }}
                    >
                      #{tag.name}
                    </button>
                  )
                })}
              </div>
            </section>
          )}

        </aside>
      </div>
    </div>
  )
}

export default PostList
