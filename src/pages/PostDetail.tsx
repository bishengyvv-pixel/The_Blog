import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

import { fetchPostBySlug, fetchPosts } from '../utils/api'
import { estimateReadingTime } from '../utils/readingTime'
import type { PostMeta } from '../utils/posts'
import CodeBlock from '../components/CodeBlock'
import TOC from '../components/TOC'
import { useSEO } from '../hooks/useSEO'

function PostDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState<{ meta: PostMeta; content: string } | null>(null)
  const [prevPost, setPrevPost] = useState<PostMeta | null>(null)
  const [nextPost, setNextPost] = useState<PostMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    setIsLoading(true)
    setError(null)

    Promise.all([
      fetchPostBySlug(slug),
      fetchPosts()
    ])
      .then(([postData, allPosts]) => {
        if (!postData) {
          setError('文章不存在')
          setIsLoading(false)
          return
        }

        setPost(postData)

        const idx = allPosts.findIndex(p => p.slug === slug)
        setPrevPost(idx > 0 ? allPosts[idx - 1] : null)
        setNextPost(idx < allPosts.length - 1 ? allPosts[idx + 1] : null)

        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.message || '加载文章失败')
        setIsLoading(false)
      })
  }, [slug])

  const readingTime = useMemo(
    () => (post ? estimateReadingTime(post.content) : null),
    [post]
  )

  useSEO(post?.meta.title, post?.meta.summary)

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="card text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container py-10">
        <div className="card text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
          <p>{error || '文章不存在'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 md:py-10">
      {/* 整体两列：正文 + TOC */}
      <div className="flex gap-12 items-start max-w-6xl mx-auto">

        {/* 正文列 */}
        <article className="flex-1 min-w-0">

          {/* 文章头部 */}
          <header className="mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {post.meta.title}
            </h1>

            <div
              className="flex flex-wrap items-center gap-3 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              <time dateTime={post.meta.date}>
                {post.meta.date}
              </time>

              {post.meta.updatedAt && (
                <>
                  <span>·</span>
                  <time dateTime={post.meta.updatedAt}>
                    更新于 {post.meta.updatedAt}
                  </time>
                </>
              )}

              {readingTime && (
                <>
                  <span>·</span>
                  <span>{readingTime.label}阅读</span>
                </>
              )}

              <Link
                to={`/categories/${post.meta.category}`}
                className="badge"
                style={{ color: 'var(--accent-color)' }}
              >
                {post.meta.category}
              </Link>

              {post.meta.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/tags/${tag}`}
                  style={{ color: 'var(--text-tertiary)' }}
                  className="hover:underline"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </header>

          {/* Markdown 正文 */}
          <div className="prose-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]}
              components={{
                // pre 包裹层：去掉 react-markdown 默认的 <pre> 外壳，让 CodeBlock 自己管理
                pre({ children }) {
                  return <>{children}</>
                },
                // 代码块：交给 CodeBlock 组件
                code({ className, children, ...props }) {
                  const isBlock = className?.startsWith('language-')
                  const code = String(children).replace(/\n$/, '')
                  if (isBlock) {
                    return (
                      <CodeBlock
                        code={code}
                        className={className}
                        language={className?.replace('language-', '')}
                      />
                    )
                  }
                  // 行内代码
                  return (
                    <code
                      className={className}
                      style={{
                        background: 'var(--bg-tertiary)',
                        padding: '0.15em 0.4em',
                        borderRadius: '4px',
                        fontSize: '0.9em',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
                // 图片懒加载
                img({ src, alt, ...props }) {
                  return (
                    <img
                      src={src}
                      alt={alt}
                      loading="lazy"
                      style={{ maxWidth: '100%', borderRadius: '8px', margin: '1rem 0' }}
                      {...props}
                    />
                  )
                },
                // 外链新标签打开
                a({ href, children, ...props }) {
                  const isExternal = href?.startsWith('http')
                  return (
                    <a
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      {...props}
                    >
                      {children}
                    </a>
                  )
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 文章底部 */}
          <footer
            className="mt-12 pt-8"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            {/* 版权声明 */}
            <p
              className="text-sm text-center mb-8"
              style={{ color: 'var(--text-tertiary)' }}
            >

            </p>

            {/* 上一篇 / 下一篇 */}
            {(prevPost || nextPost) && (
              <nav className="grid md:grid-cols-2 gap-4">
                {prevPost ? (
                  <Link
                    to={`/posts/${prevPost.slug}`}
                    className="card"
                    style={{ textAlign: 'left' }}
                  >
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                      ← 上一篇
                    </div>
                    <div
                      className="font-medium truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {prevPost.title}
                    </div>
                  </Link>
                ) : <div />}

                {nextPost ? (
                  <Link
                    to={`/posts/${nextPost.slug}`}
                    className="card"
                    style={{ textAlign: 'right' }}
                  >
                    <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                      下一篇 →
                    </div>
                    <div
                      className="font-medium truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {nextPost.title}
                    </div>
                  </Link>
                ) : <div />}
              </nav>
            )}
          </footer>
        </article>

        {/* TOC 列：仅在 xl 屏显示 */}
        <aside className="hidden xl:block w-56 shrink-0">
          <TOC content={post.content} />
        </aside>
      </div>
    </div>
  )
}

export default PostDetail
