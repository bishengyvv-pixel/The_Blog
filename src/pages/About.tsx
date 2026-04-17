import { useState, useEffect, useRef, useCallback } from 'react'
import { useSEO } from '../hooks/useSEO'

const ASCII_NAME = [
  "                                          ,--,                     ,--.              ",
  "    ,---,.     ,---,   .--.--.          ,--.'|     ,---,.        ,--.'|   ,----..    ",
  "  ,'  .'  \\ ,`--.' |  /  /    '.     ,--,  | :   ,'  .' |    ,--,:  : |  /   /   \\   ",
  ",---.' .' | |   :  : |  :  /`. /  ,---.'|  : ' ,---.'   | ,`--.'`|  ' : |   :     :  ",
  "|   |  |: | :   |  ' ;  |  |--`   |   | : _' | |   |   .' |   :  :  | | .   |  ;. /  ",
  ":   :  :  / |   :  | |  :  ;_     :   : |.'  | :   :  |-, :   |   \\ | : .   ; /--`   ",
  ":   |    ;  '   '  ;  \\  \\    `.  |   ' '  ; : :   |  ;/| |   : '  '; | ;   | ;  __  ",
  "|   :     \\ |   |  |   `----.   \\ '   |  .'. | |   :   .' '   ' ;.    ; |   : |.' .' ",
  "|   |   . | '   :  ;   __ \\  \\  | |   | :  | ' |   |  |-, |   | | \\   | .   | '_.' : ",
  "'   :  '; | |   |  '  /  /`--'  / '   : |  : ; '   :  ;/| '   : |  ; .' '   ; : \\  | ",
  "|   |  | ;  '   :  | '--'.     /  |   | '  ,/  |   |    \\ |   | '`--'   '   | '/  .' ",
  "|   :   /   ;   |.'    `--'---'   ;   : ;--'   |   :   .' '   : |       |   :    /   ",
  "|   | ,'    '---'                 |   ,/       |   | ,'   ;   |.'        \\   \\ .'    ",
  "`----'                            '---'        `----'     '---'           `---`      ",
];

const ASCII_FOR = [
  '  ███████╗ ██████╗ ██████╗ ',
  '    ██╔════╝██╔══██╗██╔══██╗',
  '████╗   ██║   ██║██████╔╝',
  ' ██╔══╝  ██║   ██║██╔══██╗',
  '██║     ╚██████╔╝██║  ██║',
  '╚═╝      ╚═════╝ ╚═╝  ╚═╝',
                         
]

const ASCII_ME = [
  ' ██████╗ ██████╗ ',
  ' ██╔════╝██╔═══██╗',
  ' █████╗  ██║   ██║',
  ' ██╔══╝  ██║   ██║',
  ' ███████╗╚██████╔╝',
  ' ╚══════╝ ╚═════╝ ',
]

const CHAR_POOL = '!@#$%&*()[]{}|;:,./<>?~`ABCDEFGHIJKLMNabcdefghijklmn0123456789░▒▓█▄▀■□▪▫'

const INFO_CARDS = [
  {
    ascii: '┌───────────┐\n│  > skills        │\n└───────────┘',
    label: 'stack',
    value: 'React · TypeScript · K8s · Ceph',
  },
  {
    ascii: '┌───────────┐\n│  ★ role          │\n└───────────┘',
    label: 'identity',
    value: 'Full-Stack & DevOps Architect',
  },
  {
    ascii: '┌───────────┐\n│  ✉ contact       │\n└───────────┘',
    label: 'reach me',
    value: 'GitHub · Email',
  },
  {
    ascii: '┌───────────┐\n│  ◈ philosophy    │\n└───────────┘',
    label: 'motto',
    value: 'Code as poetry, deploy as rhythm',
  },
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  char: string
  color: string
  alpha: number
  life: number
  size: number
  spin: number
  angle: number
  bounce: number
  friction: number
}

function rndChar() {
  return CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)]
}

function mkParticle(x: number, y: number, vx: number, vy: number, color?: string): Particle {
  return {
    x,
    y,
    vx,
    vy,
    char: rndChar(),
    color: color || `hsl(${Math.random() * 60 + 240}, 70%, 65%)`,
    alpha: 1,
    life: 1,
    size: Math.random() * 4 + 10,
    spin: (Math.random() - 0.5) * 0.2,
    angle: 0,
    bounce: 0.55 + Math.random() * 0.2,
    friction: 0.98,
  }
}

function PhysicsCanvas({
  particles,
  containerRef,
}: {
  particles: Particle[]
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas || !containerRef.current) return
      canvas.width = containerRef.current.offsetWidth
      canvas.height = containerRef.current.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const GRAVITY = 0.35

    function loop() {
      if (!canvas || !ctx) return
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      let i = particles.length
      while (i--) {
        const p = particles[i]
        p.vy += GRAVITY
        p.vx *= p.friction
        p.x += p.vx
        p.y += p.vy
        p.angle += p.spin

        if (p.y > H - 20) {
          p.y = H - 20
          p.vy *= -p.bounce
          p.vx *= 0.85
          if (Math.abs(p.vy) < 0.5) p.vy = 0
        }
        if (p.x < 0) {
          p.x = 0
          p.vx *= -0.7
        }
        if (p.x > W) {
          p.x = W
          p.vx *= -0.7
        }

        p.life -= 0.008
        p.alpha = Math.min(p.alpha, p.life)

        if (p.alpha <= 0.02 || p.y > H + 50) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.globalAlpha = p.alpha
        ctx.font = `${p.size}px monospace`
        ctx.fillStyle = p.color
        ctx.fillText(p.char, 0, 0)
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [particles, containerRef])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}

function AsciiBlock({
  lines,
  fontSize,
  color,
  delay,
}: {
  lines: string[]
  fontSize: string
  color: string
  delay: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [spans, setSpans] = useState<{ char: string; row: number; col: number }[]>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    const result: { char: string; row: number; col: number }[] = []
    lines.forEach((line, li) => {
      line.split('').forEach((c, ci) => {
        result.push({ char: c === ' ' ? '\u00A0' : c, row: li, col: ci })
      })
      if (li < lines.length - 1) {
        result.push({ char: '\n', row: li, col: line.length })
      }
    })
    setSpans(result)
  }, [lines])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const allSpans = containerRef.current.querySelectorAll('.ripple-char')
    allSpans.forEach((span) => {
      const sr = (span as HTMLElement).getBoundingClientRect()
      const cx = sr.left + sr.width / 2 - rect.left
      const cy = sr.top + sr.height / 2 - rect.top
      const dist = Math.hypot(mx - cx, my - cy)
      const force = Math.max(0, 1 - dist / 80)
      const angle = Math.atan2(cy - my, cx - mx)
      const tx = Math.cos(angle) * force * 12
      const ty = Math.sin(angle) * force * 12
      ;(span as HTMLElement).style.transform = `translate(${tx}px, ${ty}px) scale(${1 + force * 0.4})`
      ;(span as HTMLElement).style.color = force > 0.3
        ? `hsl(${260 + force * 80}, 70%, 65%)`
        : ''
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return
    const allSpans = containerRef.current.querySelectorAll('.ripple-char')
    allSpans.forEach((span) => {
      ;(span as HTMLElement).style.transform = ''
      ;(span as HTMLElement).style.color = ''
    })
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        fontSize,
        lineHeight: 1.2,
        whiteSpace: 'pre',
        color,
        display: 'inline-block',
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: "'JetBrains Mono', monospace",
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.8s ease, transform 0.8s ease`,
      }}
    >
      {spans.map((s, i) =>
        s.char === '\n' ? (
          <br key={i} />
        ) : (
          <span
            key={i}
            className="ripple-char"
            style={{
              display: 'inline-block',
              transition: 'transform 0.3s cubic-bezier(.17,.67,.33,1.3), color 0.3s',
            }}
          >
            {s.char}
          </span>
        )
      )}
    </div>
  )
}

function InfoCard({
  card,
  onPop,
}: {
  card: (typeof INFO_CARDS)[0]
  onPop: (el: HTMLDivElement) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    if (ref.current) onPop(ref.current)
  }

  return (
    <div
      ref={ref}
      onClick={handleClick}
      style={{
        background: 'var(--bg-secondary)',
        border: '0.5px solid var(--border-color)',
        borderRadius: '8px',
        padding: '1rem',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--text-tertiary)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)'
        e.currentTarget.style.transform = ''
      }}
    >
      <div
        style={{
          fontSize: '11px',
          lineHeight: 1.3,
          color: 'var(--text-tertiary)',
          marginBottom: '8px',
          whiteSpace: 'pre',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {card.ascii}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          marginBottom: '4px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {card.label}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: 'var(--text-primary)',
          fontWeight: 500,
        }}
      >
        {card.value}
      </div>
    </div>
  )
}

function About() {
  useSEO('ForMe', 'ASCII Physics · ForMe')

  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const [, forceUpdate] = useState(0)

  const explode = useCallback(() => {
    if (!containerRef.current) return
    const cx = containerRef.current.offsetWidth / 2
    const cy = 80
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2
      const spd = Math.random() * 8 + 3
      particlesRef.current.push(mkParticle(cx, cy, Math.cos(a) * spd, Math.sin(a) * spd - 4))
    }
    forceUpdate((n) => n + 1)
  }, [])

  const rain = useCallback(() => {
    if (!containerRef.current) return
    const W = containerRef.current.offsetWidth
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        particlesRef.current.push(
          mkParticle(
            Math.random() * W,
            -10,
            (Math.random() - 0.5) * 2,
            Math.random() * 3 + 2
          )
        )
        forceUpdate((n) => n + 1)
      }, i * 50)
    }
  }, [])

  const clear = useCallback(() => {
    particlesRef.current = []
    forceUpdate((n) => n + 1)
  }, [])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    for (let i = 0; i < 15; i++) {
      const a = Math.random() * Math.PI * 2
      const spd = Math.random() * 5 + 2
      particlesRef.current.push(mkParticle(mx, my, Math.cos(a) * spd, Math.sin(a) * spd - 3))
    }
    forceUpdate((n) => n + 1)
  }, [])

  const handleCardPop = useCallback((el: HTMLDivElement) => {
    el.style.transform = 'scale(0.95)'
    if (!containerRef.current) return
    const rect = el.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2 - containerRect.left
    const cy = rect.top + rect.height / 2 - containerRect.top
    for (let i = 0; i < 12; i++) {
      const a = Math.random() * Math.PI * 2
      const spd = Math.random() * 5 + 2
      particlesRef.current.push(mkParticle(cx, cy, Math.cos(a) * spd, Math.sin(a) * spd - 3))
    }
    forceUpdate((n) => n + 1)
    setTimeout(() => {
      el.style.transform = ''
    }, 150)
  }, [])

  useEffect(() => {
    document.body.style.overflow = ''
    return () => {}
  }, [])

  return (
    <div
      ref={containerRef}
      onClick={handleCanvasClick}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        fontFamily: "'JetBrains Mono', monospace",
        padding: '2rem 1.5rem',
      }}
    >
      <PhysicsCanvas particles={particlesRef.current} containerRef={containerRef} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <AsciiBlock
            lines={ASCII_FOR}
            fontSize="clamp(6px, 1.2vw, 11px)"
            color="var(--text-tertiary)"
            delay={0}
          />
          <br />
          <AsciiBlock
            lines={ASCII_NAME}
            fontSize="clamp(6px, 1.2vw, 11px)"
            color="var(--text-primary)"
            delay={200}
          />
          <br />
          <AsciiBlock
            lines={ASCII_ME}
            fontSize="clamp(6px, 1.2vw, 11px)"
            color="var(--text-tertiary)"
            delay={400}
          />
          <div
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              marginTop: '0.5rem',
              letterSpacing: '0.08em',
              fontFamily: "'JetBrains Mono', monospace",
              opacity: 0,
              animation: 'fadeInUp 0.8s ease 0.8s forwards',
            }}
          >
            // fullstack dev &amp; digital architect
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <button
            className="physics-btn"
            onClick={(e) => {
              e.stopPropagation()
              explode()
            }}
            style={{
              display: 'inline-block',
              margin: '0.5rem',
              padding: '8px 16px',
              background: 'transparent',
              border: '0.5px solid var(--border-color)',
              borderRadius: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            [ explode ]
          </button>
          <button
            className="physics-btn"
            onClick={(e) => {
              e.stopPropagation()
              rain()
            }}
            style={{
              display: 'inline-block',
              margin: '0.5rem',
              padding: '8px 16px',
              background: 'transparent',
              border: '0.5px solid var(--border-color)',
              borderRadius: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            [ rain chars ]
          </button>
          <button
            className="physics-btn"
            onClick={(e) => {
              e.stopPropagation()
              clear()
            }}
            style={{
              display: 'inline-block',
              margin: '0.5rem',
              padding: '8px 16px',
              background: 'transparent',
              border: '0.5px solid var(--border-color)',
              borderRadius: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            [ clear ]
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            margin: '1.5rem 0',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {INFO_CARDS.map((card, i) => (
            <InfoCard key={i} card={card} onPop={handleCardPop} />
          ))}
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-color)',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-tertiary)',
              fontStyle: 'italic',
              letterSpacing: '0.04em',
              lineHeight: 1.8,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            "In the silence between deployments,
            <br />
            I find my rhythm."
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default About
