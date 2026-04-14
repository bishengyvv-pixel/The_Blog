import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { getPostsByTag } from '../utils/posts'

function TagDetail() {
  const { tag } = useParams()
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    if (tag) {
      setPosts(getPostsByTag(tag))
    }
  }, [tag])

  return (
    <div className="container py-10">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: 'var(--text-primary)' }}
      >
        #{tag}
      </h1>
      <div className="grid gap-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.slug} {...post} />)
        ) : (
          <div
            className="card text-center py-16"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <p>暂无文章</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TagDetail
