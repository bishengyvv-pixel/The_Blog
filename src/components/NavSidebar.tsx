import { Link } from 'react-router-dom'
import { Code2, Server, Search, Terminal, Folder } from 'lucide-react'
import PoemTypewriter from './PoemTypewriter'
import { getAllCategories, getAllTags } from '../utils/posts'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  '前端':    <Code2    size={15} />,
  '运维':    <Server   size={15} />,
  'JS逆向':  <Search   size={15} />,
  'JS 逆向': <Search   size={15} />,
  'Python':  <Terminal size={15} />,
}
function getCategoryIcon(name: string) {
  return CATEGORY_ICONS[name] ?? <Folder size={15} />
}

const allCategories = getAllCategories()
const allTags       = getAllTags().slice(0, 20)

/** 首页同款侧边栏，供各列表页复用。showPoem 控制是否显示诗词打字机。*/
export default function NavSidebar({ showPoem = true }: { showPoem?: boolean }) {
  return (
    <aside className="hidden lg:flex flex-col gap-6 flex-[3] min-w-0 sticky top-20" style={{ maxHeight: 'calc(100vh - 7rem)', overflowY: 'auto' }}>

      {showPoem && (
        <section style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '1rem' }}>
          <PoemTypewriter compact />
        </section>
      )}

      {/* 分类 */}
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
  )
}
