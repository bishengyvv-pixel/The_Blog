import { useEffect, useState } from 'react'
import { pickRandomPoem } from '../data/poems'
import type { Poem } from '../data/poems'

const CHAR_MS       = 60
const LINE_PAUSE_MS = 260
const AUTHOR_PRE_MS = 600

// 英文手写字体映射
const EN_FONTS = {
  brush:  '"Nanum Brush Script", cursive',   // 毛笔/秀丽笔，东方墨香
  script: '"La Belle Aurore", cursive',      // 钢笔随手感，现代格言
}

// 英文诗墨色通过 CSS 变量控制，随主题切换
const EN_INK   = 'var(--poem-ink)'
const EN_INK_D = 'var(--poem-ink-light)'

function getEnFont(poem: Poem) {
  return EN_FONTS[poem.font ?? 'brush']
}

type Phase = 'poem' | 'author' | 'done'

interface Props {
  compact?: boolean
}

export default function PoemTypewriter({ compact = false }: Props) {
  const [poem]      = useState<Poem>(pickRandomPoem)
  const [poemLines, setPoemLines] = useState<string[]>([''])
  const [author,    setAuthor]    = useState('')
  const [phase,     setPhase]     = useState<Phase>('poem')

  useEffect(() => {
    let cancelled = false          // 局部变量：每次 effect 实例独立，互不干扰
    setPoemLines([''])
    setAuthor('')
    setPhase('poem')

    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    async function run() {
      await sleep(500)

      for (let l = 0; l < poem.lines.length; l++) {
        if (cancelled) return
        if (l > 0) {
          await sleep(LINE_PAUSE_MS)
          if (cancelled) return
          setPoemLines(prev => [...prev, ''])
        }
        for (let c = 0; c < poem.lines[l].length; c++) {
          if (cancelled) return
          await sleep(CHAR_MS)
          const line  = poem.lines[l]
          const chars = c + 1
          setPoemLines(prev => {
            const next = [...prev]
            next[l] = line.slice(0, chars)
            return next
          })
        }
      }

      await sleep(AUTHOR_PRE_MS)
      if (cancelled) return
      setPhase('author')

      for (let i = 0; i < poem.author.length; i++) {
        if (cancelled) return
        await sleep(CHAR_MS)
        const chars = i + 1
        setAuthor(poem.author.slice(0, chars))
      }

      if (!cancelled) setPhase('done')
    }

    run()
    return () => { cancelled = true }
  }, [poem])

  const isEn   = poem.lang === 'en'
  const enFont = getEnFont(poem)

  /* ── compact 侧边栏模式 ─────────────────────────────── */
  if (compact) {
    return (
      <div style={{ fontFamily: isEn ? enFont : '"Noto Serif SC", serif' }}>
        <div
          style={{
            fontSize:      isEn ? '0.95rem' : '0.88rem',
            lineHeight:    isEn ? 1.75      : 2,
            letterSpacing: isEn ? '0.01em'  : '0.1em',
            color:         isEn ? EN_INK    : 'var(--text-secondary)',
          }}
        >
          {poemLines.map((line, i) => (
            <div key={i}>
              {line}
              {phase === 'poem' && i === poemLines.length - 1 && (
                <span className="poem-cursor">_</span>
              )}
            </div>
          ))}
        </div>

        {phase !== 'poem' && (
          <div
            style={{
              marginTop:     '0.6rem',
              fontSize:      '0.72rem',
              color:         isEn ? EN_INK_D : 'var(--text-tertiary)',
              letterSpacing: isEn ? '0.01em' : '0.04em',
              fontStyle:     isEn ? 'italic' : 'normal',
            }}
          >
            {author}
            <span className="poem-cursor">_</span>
          </div>
        )}
      </div>
    )
  }

  /* ── 全尺寸首屏模式 ──────────────────────────────────── */
  return (
    <div style={{ display: 'inline-block', textAlign: 'left' }}>
      <div
        style={{
          fontFamily:    isEn ? enFont : '"Noto Serif SC", serif',
          fontSize:      isEn ? 'clamp(1.2rem, 2.5vw, 1.6rem)' : 'clamp(1.25rem, 3vw, 1.75rem)',
          lineHeight:    isEn ? 2      : 2.2,
          letterSpacing: isEn ? '0.02em' : '0.12em',
          color:         isEn ? EN_INK   : 'var(--text-primary)',
        }}
      >
        {poemLines.map((line, i) => (
          <div key={i}>
            {line}
            {phase === 'poem' && i === poemLines.length - 1 && (
              <span className="poem-cursor">_</span>
            )}
          </div>
        ))}
      </div>

      {phase !== 'poem' && (
        <div
          style={{
            marginTop:     '1.25rem',
            fontFamily:    isEn ? enFont : '"Noto Serif SC", serif',
            fontSize:      isEn ? '1rem' : '0.9rem',
            letterSpacing: isEn ? '0.01em' : '0.06em',
            color:         isEn ? EN_INK_D : 'var(--text-tertiary)',
            fontStyle:     isEn ? 'italic' : 'normal',
          }}
        >
          {author}
          <span className="poem-cursor">_</span>
        </div>
      )}
    </div>
  )
}
