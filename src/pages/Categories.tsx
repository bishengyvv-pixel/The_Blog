import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllCategories } from '../utils/posts'
import { useSEO } from '../hooks/useSEO'

const categoryDescriptions: Record<string, string> = {
  '前端': 'React、工程化、性能优化',
  '运维': '服务器配置、Docker、CI/CD',
  'JS逆向': '浏览器调试、混淆分析',
  'JS 逆向': '浏览器调试、混淆分析',
  'Python': '爬虫、自动化、数据分析'
}

function Categories() {
  const [categories, setCategories] = useState<any[]>([])

  useSEO('分类', '按技术领域浏览文章分类。')

  useEffect(() => {
    setCategories(getAllCategories())
  }, [])

  return (
    <div className="container py-10">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: 'var(--text-primary)' }}
      >
        分类
      </h1>
      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Link key={cat.name} to={`/categories/${cat.name}`} className="card">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {cat.name}
            </h2>
            <p
              className="text-sm mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              {categoryDescriptions[cat.name] || '技术文章'}
            </p>
            <span
              className="text-sm"
              style={{ color: 'var(--accent-color)' }}
            >
              {cat.count} 篇文章 →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Categories
