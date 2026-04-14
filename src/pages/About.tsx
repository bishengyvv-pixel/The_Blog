import { useSEO } from '../hooks/useSEO'

function About() {
  useSEO('关于', '了解博主的技术背景、技术栈与联系方式。')

  return (
    <div className="container py-10">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: 'var(--text-primary)' }}
      >
        关于我
      </h1>
      <div
        className="card"
        style={{ maxWidth: '800px' }}
      >
        <div
          className="w-24 h-24 rounded-full mx-auto mb-6"
          style={{
            background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: 'white'
          }}
        >
          👨‍💻
        </div>
        <div
          style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}
        >
          <p className="mb-4">
            你好，欢迎来到我的技术博客！
          </p>
          <p className="mb-4">
            我是一名热爱技术的开发者，这个博客是我记录学习历程、沉淀技术知识的地方。
            在这里，我会分享我在前端开发、运维、JS 逆向、Python 等领域的学习心得和实践经验。
          </p>
          
          <h2
            className="text-xl font-semibold mt-8 mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            技术栈
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>前端：React、TypeScript、Vite</li>
            <li>后端：Node.js</li>
            <li>工具：Docker、Git、Linux</li>
            <li>其他：Python、逆向工程</li>
          </ul>

          <h2
            className="text-xl font-semibold mt-8 mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            联系方式
          </h2>
          <p>
            GitHub：<a href="https://github.com" target="_blank" rel="noopener noreferrer">@your-username</a><br />
            邮箱：your@email.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
