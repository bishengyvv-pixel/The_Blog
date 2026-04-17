import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import NavSidebar from '../components/NavSidebar'
import { getPostsByTag } from '../utils/posts'
import { useSEO } from '../hooks/useSEO'

function TagDetail() {
  const { tag } = useParams()
  const posts = useMemo(
    () => (tag ? getPostsByTag(tag) : []),
    [tag]
  )

  useSEO(`#${tag}`, `标签"${tag}"下的所有文章。`)

  return (
    <div className="container py-8 md:py-12">
      <div className="flex gap-10 items-start">

        <main className="flex-[7] min-w-0">
          <div className="flex items-baseline gap-3 mb-3">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              #{tag}
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

        <NavSidebar showPoem={false} />
      </div>
    </div>
  )
}

export default TagDetail
