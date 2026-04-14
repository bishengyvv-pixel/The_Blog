import { useState, useEffect } from 'react'

function Footer() {
  const [uptime, setUptime] = useState<string>('')

  useEffect(() => {
    const startDate = new Date('2026-04-14')
    
    const calculateUptime = () => {
      const now = new Date()
      const diff = now.getTime() - startDate.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (days > 365) {
        const years = Math.floor(days / 365)
        const remainingDays = days % 365
        setUptime(`${years} 年 ${remainingDays} 天 ${hours} 时 ${minutes} 分`)
      } else {
        setUptime(`${days} 天 ${hours} 时 ${minutes} 分`)
      }
    }

    calculateUptime()
    const interval = setInterval(calculateUptime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer
      className="mt-16 py-8"
      style={{
        borderTop: `1px solid var(--border-color)`,
        backgroundColor: 'var(--bg-secondary)'
      }}
    >
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              © {new Date().getFullYear()} 技术博客. All rights reserved.
            </p>
            {uptime && (
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                已运行 {uptime}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="btn-icon"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="mailto:your@email.com"
              aria-label="Email"
              className="btn-icon"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
