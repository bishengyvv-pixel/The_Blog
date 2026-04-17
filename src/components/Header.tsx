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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--bg-primary)]/95 backdrop-blur-sm shadow-md'
          : 'bg-transparent'
      }`}
      style={{
        borderBottom: isScrolled ? `1px solid var(--border-color)` : 'none'
      }}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            The_Blog
          </Link>

          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm font-medium"
                  style={{
                    padding: '6px 16px',
                    borderRadius: '8px',
                    transition: 'background-color 0.25s ease, color 0.25s ease',
                    color: active ? 'var(--accent-color)' : 'var(--text-secondary)',
                    backgroundColor: active
                      ? 'var(--nav-active-bg)'
                      : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--nav-hover-bg)'
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            className="md:hidden pb-4 border-t"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
          >
            <div className="pt-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-4 py-3 rounded-md text-base font-medium transition-colors duration-200"
                  style={{
                    color:
                      location.pathname === item.path
                        ? 'var(--accent-color)'
                        : 'var(--text-secondary)',
                    backgroundColor:
                      location.pathname === item.path
                        ? 'var(--bg-tertiary)'
                        : 'transparent'
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
