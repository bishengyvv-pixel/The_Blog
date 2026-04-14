import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllSeries } from '../utils/posts'

function SeriesList() {
  const [series, setSeries] = useState<any[]>([])

  useEffect(() => {
    setSeries(getAllSeries())
  }, [])

  return (
    <div className="container py-10">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: 'var(--text-primary)' }}
      >
        专题
      </h1>
      {series.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {series.map((s) => (
            <Link key={s.name} to={`/series/${s.name}`} className="card">
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                📚 {s.name}
              </h2>
              <span
                className="text-sm"
                style={{ color: 'var(--accent-color)' }}
              >
                {s.count} 篇文章 →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div
          className="card text-center py-16"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <p>暂无专题</p>
        </div>
      )}
    </div>
  )
}

export default SeriesList
