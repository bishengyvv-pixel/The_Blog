import { getAllTags } from '../utils/posts'
import TagCloud from '../components/TagCloud'
import { useSEO } from '../hooks/useSEO'

const tags = getAllTags()

function Tags() {
  useSEO('标签', '按标签浏览所有文章。')

  if (tags.length === 0) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
          标签
        </h1>
        <div className="card text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
          <p>暂无标签</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <div className="flex items-baseline gap-3 mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          标签
        </h1>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          {tags.length} 个标签
        </span>
      </div>

      <div className="card p-6">
        <TagCloud tags={tags} />
      </div>

      {/* 文字备用列表（无障碍 + SEO） */}
      <ul className="sr-only" aria-label="所有标签">
        {tags.map(t => (
          <li key={t.name}>
            <a href={`/tags/${t.name}`}>{t.name}（{t.count} 篇）</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Tags
