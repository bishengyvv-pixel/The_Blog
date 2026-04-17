import { useMemo, useRef } from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

function CodeBlock({ code, language, className }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null)

  const displayLang = language ?? className?.replace('language-', '') ?? 'text'
  const lines = code.trimEnd().split('\n')

  const highlighted = useMemo(() => {
    const raw = code.trimEnd()
    try {
      if (displayLang !== 'text' && hljs.getLanguage(displayLang)) {
        return hljs.highlight(raw, { language: displayLang }).value
      }
      return hljs.highlightAuto(raw).value
    } catch {
      return raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }
  }, [code, displayLang])

  function handleCopy() {
    navigator.clipboard.writeText(code.trimEnd())
  }

  return (
    <div
      className="code-block-wrapper"
      style={{
        position: 'relative',
        margin: '1.5rem 0',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        background: '#282c34',  
      }}
    >
      {/* 头部：语言 + 复制按钮 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.4rem 1rem',
          background: 'rgba(0,0,0,0.25)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            color: '#abb2bf',
            fontFamily: 'JetBrains Mono, monospace',
            textTransform: 'lowercase',
            letterSpacing: '0.04em',
          }}
        >
          {displayLang}
        </span>
        <button
          onClick={handleCopy}
          className="code-copy-btn"
        >
          Copy
        </button>
      </div>

      {/* 代码区：行号 + 高亮内容 */}
      <div style={{ display: 'flex', overflowX: 'auto' }}>
        {/* 行号列 */}
        <div
          aria-hidden="true"
          style={{
            padding: '1rem 0.75rem',
            textAlign: 'right',
            userSelect: 'none',
            color: '#4b5263',
            fontSize: '0.8rem',
            lineHeight: '1.6',
            fontFamily: 'JetBrains Mono, monospace',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            minWidth: '3rem',
            flexShrink: 0,
          }}
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* 代码内容 */}
        <pre
          style={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            border: 'none',
            borderRadius: 0,
            flex: 1,
            minWidth: 0,
            fontSize: '0.875rem',
            lineHeight: '1.6',
            overflowX: 'visible',
          }}
        >
          <code
            ref={codeRef}
            className={`hljs language-${displayLang}`}
            style={{
              background: 'transparent',
              padding: 0,
              fontSize: 'inherit',
              lineHeight: 'inherit',
              fontFamily: 'JetBrains Mono, monospace',
              whiteSpace: 'pre',       // 保留所有空白和缩进
              wordBreak: 'normal',
              overflowWrap: 'normal',
            }}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  )
}

export default CodeBlock
