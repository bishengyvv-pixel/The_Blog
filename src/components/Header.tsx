import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/posts', label: '文章' },
  { path: '/series', label: '专题' },
  { path: '/timeline', label: '时间线' },
  { path: '/about', label: '关于' },
]

function Header() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  return (
    <header
      className="sticky top-0 z-50 bg-[var(--bg-primary)] border-b-[4px] border-[var(--border-color)] shadow-brutal-sm"
    >
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-2xl font-black uppercase tracking-wider"
            style={{ color: 'var(--text-primary)' }}
          >
            THE_BLOG
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm font-extrabold uppercase px-4 py-2 border-[3px] border-[var(--border-color)] transition-none"
                  style={{
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: active
                      ? 'var(--nav-active-bg)'
                      : 'var(--bg-secondary)',
                    boxShadow: active ? '2px 2px 0 0 var(--border-color)' : 'none',
                    transform: active ? 'translate(-2px, -2px)' : 'none',
                  }}
                  onMouseEnter={e => {
                    const target = e.currentTarget as HTMLElement
                    if (!active) {
                      target.style.backgroundColor = 'var(--nav-hover-bg)'
                      target.style.boxShadow = '2px 2px 0 0 var(--border-color)'
                      target.style.transform = 'translate(-2px, -2px)'
                    }
                  }}
                  onMouseLeave={e => {
                    const target = e.currentTarget as HTMLElement
                    if (!active) {
                      target.style.backgroundColor = 'var(--bg-secondary)'
                      target.style.boxShadow = 'none'
                      target.style.transform = 'none'
                    }
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon"
              aria-label="菜单"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div
            className="md:hidden pb-4 border-t-[3px]"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
          >
            <div className="pt-4 flex flex-col gap-2 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-4 py-3 text-base font-extrabold uppercase border-[3px] border-[var(--border-color)]"
                  style={{
                    color:
                      location.pathname === item.path
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                    backgroundColor:
                      location.pathname === item.path
                        ? 'var(--nav-active-bg)'
                        : 'var(--bg-tertiary)',
                    boxShadow: location.pathname === item.path ? '2px 2px 0 0 var(--border-color)' : 'none',
                    transform: location.pathname === item.path ? 'translate(-2px, -2px)' : 'none',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
