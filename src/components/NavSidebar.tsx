import { Link } from 'react-router-dom'
import PoemTypewriter from './PoemTypewriter'
import CategorySection from './CategorySection'

/** 首页同款侧边栏，供各列表页复用。showPoem 控制是否显示诗词打字机。*/
export default function NavSidebar({
  showPoem = true,
  categories = [],
  tags = []
}: {
  showPoem?: boolean,
  categories?: Array<{ name: string; count: number }>,
  tags?: Array<{ name: string; count: number }>
}) {
  return (
    <aside className="hidden lg:flex flex-col gap-6 flex-[3] min-w-0 sticky top-20" style={{ maxHeight: 'calc(100vh - 7rem)', overflowY: 'auto' }}>

      {showPoem && (
        <section className="border-[3px] border-[var(--border-color)] p-4 bg-[var(--bg-secondary)] shadow-brutal-sm">
          <PoemTypewriter compact />
        </section>
      )}

      <CategorySection categories={categories} />

      {/* 标签 */}
      {tags.length > 0 && (
        <section className="border-[3px] border-[var(--border-color)] p-4 bg-[var(--bg-secondary)] shadow-brutal-sm">
          <h3
            className="text-sm font-black uppercase mb-4 tracking-wider"
            style={{ color: 'var(--text-primary)', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}
          >
            标签
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link
                key={tag.name}
                to={`/tags/${tag.name}`}
                className="badge"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', fontWeight: '800' }}
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
