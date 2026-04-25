import { Link } from 'react-router-dom'
import { getCategoryIcon as getCategoryIconComponent } from '../data/categories'

type CategoryItem = {
  name: string
  count: number
}

type CategorySectionProps =
  | {
      variant?: 'link'
      categories: CategoryItem[]
      activeCategory?: never
      onCategorySelect?: never
      iconSize?: number
      title?: string
    }
  | {
      variant: 'button'
      categories: CategoryItem[]
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
  categories,
  activeCategory,
  onCategorySelect,
  iconSize = 15,
  title = '分类',
}: CategorySectionProps) {
  if (categories.length === 0) return null

  return (
    <section>
      <h3
        className="text-sm font-semibold mb-3"
        style={{ color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}
      >
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const active = variant === 'button' && activeCategory === cat.name
          const iconColor = active ? '#fff' : 'var(--accent-color)'
          const countColor = active ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)'

          const content = (
            <>
              <span style={{ color: iconColor, display: 'flex' }}>
                {renderCategoryIcon(cat.name, iconSize)}
              </span>
              {cat.name}
              <span style={{ color: countColor, fontSize: '0.7rem' }}>
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
                className="flex items-center gap-1.5 rounded-lg text-sm transition-colors"
                style={{
                  color: active ? '#fff' : 'var(--text-secondary)',
                  background: active ? 'var(--accent-color)' : 'var(--bg-secondary)',
                  border: `1px solid ${active ? 'var(--accent-color)' : 'var(--border-color)'}`,
                  padding: '0.3rem 0.75rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
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
              className="flex items-center gap-1.5 rounded-lg text-sm transition-colors"
              style={{
                color: 'var(--text-secondary)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                padding: '0.3rem 0.75rem',
                whiteSpace: 'nowrap',
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
