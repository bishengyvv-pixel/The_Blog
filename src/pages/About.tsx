import { useSEO } from '../hooks/useSEO'

function About() {
  useSEO('关于', '了解博主的技术背景、技术栈与联系方式。')

  return (
    <div className="container py-8 md:py-12">
      <div className="flex gap-10 items-start">

        <main className="flex-[7] min-w-0">
          <div className="flex items-baseline gap-3 mb-3">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              关于我
            </h1>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '1.25rem' }} />

          {/* 头像卡片 */}
          <div className="card flex items-center gap-5 mb-4">
            <div
              style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                flexShrink: 0,
              }}
            >
              👨‍💻
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Bisheng
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                热爱技术 · 持续学习
              </p>
            </div>
          </div>

          {/* 正文卡片 */}
          <div className="card" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p className="mb-4">你好，欢迎来到我的技术博客！</p>
            <p className="mb-4">
              我是一名热爱技术的开发者，这个博客是我记录学习历程、沉淀技术知识的地方。
              在这里，我会分享我在前端开发、运维、JS 逆向、Python 等领域的学习心得和实践经验。
            </p>

            <h2 className="text-base font-semibold mt-6 mb-3" style={{ color: 'var(--text-primary)' }}>
              技术栈
            </h2>
            <ul className="list-disc list-inside space-y-1.5">
              <li>前端：React、TypeScript、Vite</li>
              <li>后端：Node.js</li>
              <li>工具：Docker、Git、Linux</li>
              <li>其他：Python、逆向工程</li>
            </ul>

            <h2 className="text-base font-semibold mt-6 mb-3" style={{ color: 'var(--text-primary)' }}>
              联系方式
            </h2>
            <p>
              GitHub：<a href="https://github.com" target="_blank" rel="noopener noreferrer">@your-username</a><br />
              邮箱：your@email.com
            </p>
          </div>
        </main>

      </div>
    </div>
  )
}

export default About
