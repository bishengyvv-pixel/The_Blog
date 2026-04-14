import { Link } from 'react-router-dom'
import { getAllPosts } from '../utils/posts'
import type { PostMeta } from '../utils/posts'

// 按年 → 月分组
type MonthGroup = { month: string; posts: PostMeta[] }
type YearGroup  = { year: string;  months: MonthGroup[] }

function groupByYearMonth(posts: PostMeta[]): YearGroup[] {
  const yearMap = new Map<string, Map<string, PostMeta[]>>()

  posts.forEach(post => {
    const d    = new Date(post.date)
    const year = `${d.getFullYear()}年`
    const month = `${d.getMonth() + 1}月`

    if (!yearMap.has(year)) yearMap.set(year, new Map())
    const monthMap = yearMap.get(year)!
    if (!monthMap.has(month)) monthMap.set(month, [])
    monthMap.get(month)!.push(post)
  })

  // 年倒序，月倒序
  return [...yearMap.entries()]
    .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
    .map(([year, monthMap]) => ({
      year,
      months: [...monthMap.entries()]
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([month, posts]) => ({ month, posts })),
    }))
}

const allPosts = getAllPosts()
const groups   = groupByYearMonth(allPosts)
const total    = allPosts.length

function Timeline() {
  if (total === 0) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
          时间线
        </h1>
        <div className="card text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
          <p>暂无文章</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <div className="flex items-baseline gap-3 mb-10">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          时间线
        </h1>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          {total} 篇文章 · {groups.length} 年
        </span>
      </div>

      {groups.map(yearGroup => (
        <section key={yearGroup.year} className="mb-12">
          {/* 年份标题 */}
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            {yearGroup.year}
          </h2>

          {yearGroup.months.map(monthGroup => (
            <div key={monthGroup.month} className="mb-8 ml-4">
              {/* 月份标题 */}
              <h3
                className="text-sm font-semibold mb-4 flex items-center gap-2"
                style={{ color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent-color)',
                    flexShrink: 0,
                  }}
                />
                {monthGroup.month}
              </h3>

              {/* 该月文章列表 */}
              <div
                className="ml-4 pl-4 grid gap-3"
                style={{ borderLeft: '1px solid var(--border-color)' }}
              >
                {monthGroup.posts.map(post => (
                  <Link
                    key={post.slug}
                    to={`/posts/${post.slug}`}
                    className="group flex items-start gap-3"
                    style={{ textDecoration: 'none' }}
                  >
                    {/* 日期 */}
                    <time
                      dateTime={post.date}
                      style={{
                        flexShrink: 0,
                        fontSize: '0.8rem',
                        color: 'var(--text-tertiary)',
                        paddingTop: '0.15rem',
                        minWidth: '3rem',
                      }}
                    >
                      {String(new Date(post.date).getDate()).padStart(2, '0')} 日
                    </time>

                    {/* 内容 */}
                    <div>
                      <p
                        className="font-medium group-hover:underline"
                        style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}
                      >
                        {post.title}
                      </p>
                      <span className="badge mt-1 inline-block text-xs">
                        {post.category}
                      </span>
                      {post.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="ml-1 text-xs"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

export default Timeline
