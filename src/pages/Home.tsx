import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard'
import NavSidebar from '../components/NavSidebar'
import { fetchPosts } from '../utils/api'
import { useSEO } from '../hooks/useSEO'
import type { PostMeta } from '../utils/posts'

export default function Home() {
  const [recentPosts, setRecentPosts] = useState<PostMeta[]>([])
  const [tags, setTags] = useState<Array<{ name: string; count: number }>>([])
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useSEO(undefined, '个人技术博客，记录前端、运维、JS 逆向、Python 等技术学习历程。')

  useEffect(() => {
    fetchPosts()
      .then(posts => {
        setRecentPosts(posts.slice(0, 8))

        // 计算标签
        const tagMap = new Map<string, number>()
        posts.forEach(post => {
          post.tags.forEach(tag => {
            tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
          })
        })
        const sortedTags = Array.from(tagMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20)

        setTags(sortedTags)

        // 计算分类
        const categoryMap = new Map<string, number>()
        posts.forEach(post => {
          categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1)
        })
        const sortedCategories = Array.from(categoryMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)

        setCategories(sortedCategories)
        setIsLoading(false)
      })
      .catch(() => {
        setRecentPosts([])
        setTags([])
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="container py-8 md:py-12">
      <div className="flex gap-10 items-start">

        <main className="flex-[7] min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-2xl font-black uppercase tracking-wider"
              style={{ color: 'var(--text-primary)' }}
            >
              最新文章
            </h2>
            <Link
              to="/posts"
              className="btn text-sm font-extrabold uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              查看全部
            </Link>
          </div>
          <hr style={{ border: 'none', borderTop: '4px solid var(--border-color)', marginBottom: '2rem' }} />

          <div className="grid gap-3">
            {isLoading ? (
              <div className="card text-center py-12" style={{ color: 'var(--text-tertiary)' }}>
                <p>加载中...</p>
              </div>
            ) : recentPosts.length > 0 ? (
              recentPosts.map(post => (
                <PostCard key={post.slug} {...post} />
              ))
            ) : (
              <div
                className="card text-center py-12"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <p>暂无文章，开始写作吧！</p>
              </div>
            )}
          </div>
        </main>

        {/* ── 右列 30%：侧边栏 ── */}
        <NavSidebar categories={categories} tags={tags} />

      </div>
    </div>
  )
}
