import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import NavSidebar from '../components/NavSidebar'
import { fetchPosts } from '../utils/api'
import type { PostMeta } from '../utils/posts'
import { useSEO } from '../hooks/useSEO'

function CategoryDetail() {
  const { category } = useParams()
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

  const posts = useMemo(
    () => allPosts.filter(p => p.category === category),
    [allPosts, category]
  )

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

  useSEO(category ?? '分类', `分类"${category}"下的所有文章。`)

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
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {category}
            </h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              {posts.length} 篇
            </span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '1.25rem' }} />

          <div className="grid gap-3">
            {posts.length > 0 ? (
              posts.map(post => <PostCard key={post.slug} {...post} />)
            ) : (
              <div className="card text-center py-12" style={{ color: 'var(--text-tertiary)' }}>
                <p>暂无文章</p>
              </div>
            )}
          </div>
        </main>

        <NavSidebar showPoem={false} categories={categories} tags={tags} />
      </div>
    </div>
  )
}

export default CategoryDetail
