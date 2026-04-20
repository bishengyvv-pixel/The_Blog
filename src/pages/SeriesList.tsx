import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import NavSidebar from '../components/NavSidebar'
import { fetchPosts } from '../utils/api'
import type { PostMeta } from '../utils/posts'
import { useSEO } from '../hooks/useSEO'

function SeriesList() {
  const [allPosts, setAllPosts] = useState<PostMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  // 计算系列
  const allSeries = useMemo(() => {
    const seriesMap = new Map<string, number>()
    allPosts.forEach(post => {
      if (post.series) {
        seriesMap.set(post.series, (seriesMap.get(post.series) || 0) + 1)
      }
    })
    return Array.from(seriesMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [allPosts])

  // 计算分类和标签
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>()
    allPosts.forEach(post => {
      categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1)
    })
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [allPosts])

  const tags = useMemo(() => {
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

  useSEO('专题', '按专题系列浏览文章，系统学习技术知识。')

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

        <main className="flex-[7] min-w-0">
          <div className="flex items-baseline gap-3 mb-3">
            <h2
              className="text-xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              专题
            </h2>
            <span
              style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              {allSeries.length} 个系列
            </span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '1.25rem' }} />

          {allSeries.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {allSeries.map(s => (
                <Link key={s.name} to={`/series/${s.name}`} className="card">
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: 'var(--accent-color)', display: 'flex' }}>
                      <BookOpen size={16} />
                    </span>
                    <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {s.name}
                    </h2>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--accent-color)' }}>
                    {s.count} 篇文章 →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12" style={{ color: 'var(--text-tertiary)' }}>
              <p>暂无专题</p>
            </div>
          )}
        </main>

        <NavSidebar showPoem={true} categories={categories} tags={tags} />
      </div>
    </div>
  )
}

export default SeriesList
