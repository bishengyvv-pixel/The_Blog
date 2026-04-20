import { Link } from 'react-router-dom'
import { getCategoryIcon as getCategoryIconComponent } from '../data/categories'

type CategoryItem = {
  name: string
  count: number
}

type CategorySectionProps =
  | {
      variant?: 'link'
      categories?: CategoryItem[]
      activeCategory?: never
      onCategorySelect?: never
      iconSize?: number
      title?: string
    }
  | {
      variant: 'button'
      categories?: CategoryItem[]
      activeCategory?: string | null
      onCategorySelect: (category: string | null) => void
      iconSize?: number
      title?: string
    }

function renderCategoryIcon(name: string, size: number) {
  const Icon = getCategoryIconComponent(name)
  return <Icon size={size} />
}

export default function CategorySection({
  variant = 'link',
  categories = [],
  activeCategory,
  onCategorySelect,
  iconSize = 15,
  title = '分类',
}: CategorySectionProps) {
  if (categories.length === 0) return null

  return (
    <section className="border-[3px] border-[var(--border-color)] p-4 bg-[var(--bg-secondary)] shadow-brutal-sm">
      <h3
        className="text-sm font-black uppercase mb-4 tracking-wider"
        style={{ color: 'var(--text-primary)', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}
      >
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const active = variant === 'button' && activeCategory === cat.name
          const iconColor = active ? 'var(--text-primary)' : 'var(--accent-color)'
          const countColor = active ? 'var(--text-secondary)' : 'var(--text-tertiary)'

          const content = (
            <>
              <span style={{ color: iconColor, display: 'flex', fontWeight: 'bold' }}>
                {renderCategoryIcon(cat.name, iconSize)}
              </span>
              <span className="font-extrabold">{cat.name}</span>
              <span style={{ color: countColor, fontSize: '0.75rem', fontWeight: '800' }}>
                ({cat.count})
              </span>
            </>
          )

          if (variant === 'button') {
            const handleClick = () => {
              if (!onCategorySelect) return
              onCategorySelect(active ? null : cat.name)
            }

            return (
              <button
                key={cat.name}
                type="button"
                onClick={handleClick}
                className="flex items-center gap-1.5 text-sm transition-none border-[3px] border-[var(--border-color)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-sm"
                style={{
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: active ? 'var(--nav-active-bg)' : 'var(--bg-primary)',
                  padding: '0.4rem 0.85rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  fontWeight: '800',
                  boxShadow: active ? '2px 2px 0 0 var(--border-color)' : 'none',
                  transform: active ? 'translate(-2px, -2px)' : 'none',
                }}
              >
                {content}
              </button>
            )
          }

          return (
            <Link
              key={cat.name}
              to={`/categories/${cat.name}`}
              className="flex items-center gap-1.5 text-sm transition-none border-[3px] border-[var(--border-color)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-sm hover:bg-[var(--nav-hover-bg)]"
              style={{
                color: 'var(--text-secondary)',
                background: 'var(--bg-primary)',
                padding: '0.4rem 0.85rem',
                whiteSpace: 'nowrap',
                fontWeight: '800',
              }}
            >
              {content}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
