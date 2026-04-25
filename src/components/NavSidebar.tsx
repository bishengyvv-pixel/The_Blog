import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PoemTypewriter from './PoemTypewriter'
import CategorySection from './CategorySection'
import { fetchPosts } from '../utils/api'

/** 首页同款侧边栏，供各列表页复用。showPoem 控制是否显示诗词打字机。*/
export default function NavSidebar({ showPoem = true }: { showPoem?: boolean }) {
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([])
  const [tags, setTags] = useState<Array<{ name: string; count: number }>>([])

  useEffect(() => {
    fetchPosts()
      .then(posts => {
        const catMap = new Map<string, number>()
        const tagMap = new Map<string, number>()
        posts.forEach(post => {
          catMap.set(post.category, (catMap.get(post.category) || 0) + 1)
          post.tags.forEach(tag => {
            tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
          })
        })
        setCategories(Array.from(catMap.entries()).map(([name, count]) => ({ name, count })))
        setTags(Array.from(tagMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 20))
      })
      .catch(() => {
        setCategories([])
        setTags([])
      })
  }, [])

  return (
    <aside className="hidden lg:flex flex-col gap-6 flex-[3] min-w-0 sticky top-20" style={{ maxHeight: 'calc(100vh - 7rem)', overflowY: 'auto' }}>

      {showPoem && (
        <section style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '1rem' }}>
          <PoemTypewriter compact />
        </section>
      )}

      <CategorySection categories={categories} />

      {/* 标签 */}
      {tags.length > 0 && (
        <section>
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}
          >
            标签
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <Link
                key={tag.name}
                to={`/tags/${tag.name}`}
                className="badge"
                style={{ fontSize: '0.7rem', padding: '0.15rem 0.55rem' }}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </section>
      )}

    </aside>
  )
}
