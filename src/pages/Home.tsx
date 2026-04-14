import { Link } from 'react-router-dom'
import {
  Code2, Server, Search, Terminal, Folder,
} from 'lucide-react'

import PostCard from '../components/PostCard'
import PoemTypewriter from '../components/PoemTypewriter'
import { getAllPosts, getAllCategories, getAllTags } from '../utils/posts'
import { useSEO } from '../hooks/useSEO'

// 分类 → SVG 图标映射
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  '前端':    <Code2   size={15} />,
  '运维':    <Server  size={15} />,
  'JS逆向':  <Search  size={15} />,
  'JS 逆向': <Search  size={15} />,
  'Python':  <Terminal size={15} />,
}

function getCategoryIcon(name: string) {
  return CATEGORY_ICONS[name] ?? <Folder size={15} />
}

const allPosts      = getAllPosts().slice(0, 8)
const allCategories = getAllCategories()
const allTags       = getAllTags().slice(0, 20)

export default function Home() {
  useSEO(undefined, '个人技术博客，记录前端、运维、JS 逆向、Python 等技术学习历程。')

  return (
    <div className="container py-8 md:py-12">
      <div className="flex gap-10 items-start">

        {/* ── 左列 70%：最新文章 ── */}
        <main className="flex-[7] min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              最新文章
            </h2>
            <Link
              to="/posts"
              className="text-sm"
              style={{ color: 'var(--accent-color)' }}
            >
              查看全部 →
            </Link>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '1.25rem' }} />

          <div className="grid gap-3">
            {allPosts.length > 0 ? (
              allPosts.map(post => (
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
        <aside
          className="hidden lg:flex flex-col gap-6 flex-[3] min-w-0 sticky top-20"
        >
          {/* 诗词格言 */}
          <section
            style={{
              borderLeft: '2px solid var(--border-color)',
              paddingLeft: '1rem',
            }}
          >
            <PoemTypewriter compact />
          </section>

          {/* 分类浏览 */}
          <section>
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}
            >
              分类
            </h3>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(cat => (
                <Link
                  key={cat.name}
                  to={`/categories/${cat.name}`}
                  className="flex items-center gap-1.5 rounded-lg text-sm transition-colors"
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    padding: '0.3rem 0.75rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ color: 'var(--accent-color)', display: 'flex' }}>
                    {getCategoryIcon(cat.name)}
                  </span>
                  {cat.name}
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>
                    ({cat.count})
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* 标签 */}
          {allTags.length > 0 && (
            <section>
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}
              >
                标签
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map(tag => (
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

      </div>
    </div>
  )
}
