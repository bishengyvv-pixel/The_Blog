import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategoryDescription } from '../data/categories'
import { fetchPosts } from '../utils/api'
import { useSEO } from '../hooks/useSEO'
import type { PostMeta } from '../utils/posts'

function Categories() {
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useSEO('分类', '按技术领域浏览文章分类。')

  useEffect(() => {
    setIsLoading(true)
    fetchPosts()
      .then(posts => {
        const categoryMap = new Map<string, number>()
        posts.forEach(post => {
          categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1)
        })
        const categories = Array.from(categoryMap.entries())
          .map(([name, count]) => ({ name, count }))
        setCategories(categories)
        setIsLoading(false)
      })
      .catch(() => {
        setCategories([])
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="card text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: 'var(--text-primary)' }}
      >
        分类
      </h1>
      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Link key={cat.name} to={`/categories/${cat.name}`} className="card">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {cat.name}
            </h2>
            <p
              className="text-sm mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              {getCategoryDescription(cat.name)}
            </p>
            <span
              className="text-sm"
              style={{ color: 'var(--accent-color)' }}
            >
              {cat.count} 篇文章 →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Categories
