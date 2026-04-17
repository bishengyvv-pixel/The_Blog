import { Link } from 'react-router-dom'
import PoemTypewriter from './PoemTypewriter'
import CategorySection from './CategorySection'
import { getAllTags } from '../utils/posts'

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

      <CategorySection />

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
