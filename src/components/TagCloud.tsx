import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { prepare, measureNaturalWidth } from '@chenglou/pretext'

interface TagItem {
  name: string
  count: number
}

interface Chip {
  name: string
  x: number
  y: number
  w: number
  h: number
  fontSize: number
  color: string
}

const PADDING_X = 16
const PADDING_Y = 8
const GAP_X = 10
const GAP_Y = 10
const MIN_FONT = 13
const MAX_FONT = 28

// 根据深色/浅色主题取色
function getColors(isDark: boolean) {
  return {
    bg: isDark ? '#1a1a1a' : '#f0f0f0',
    text: isDark ? '#ffffff' : '#000000',
    accent: '#ffcc00',
    hover: '#ffaa00',
    border: isDark ? '#ffffff' : '#000000',
  }
}

function TagCloud({ tags, onTagClick }: { tags: TagItem[]; onTagClick?: (tag: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [chips, setChips] = useState<Chip[]>([])
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 200 })
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  )
  const navigate = useNavigate()

  // 监听主题切换
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  // 用 pretext 测量宽度 → 布局 chips
  useLayoutEffect(() => {
    if (tags.length === 0 || !containerRef.current) return

    const containerW = containerRef.current.clientWidth || 800
    const maxCount = Math.max(...tags.map(t => t.count))
    const minCount = Math.min(...tags.map(t => t.count))
    const range = maxCount - minCount || 1

    // 为每个 tag 计算字号 + pretext 测量文字宽度
    const measured = tags.map(tag => {
      const ratio = (tag.count - minCount) / range
      const fontSize = Math.round(MIN_FONT + ratio * (MAX_FONT - MIN_FONT))
      const font = `900 ${fontSize}px "Inter", "Montserrat", "Noto Sans SC", sans-serif`
      let textW = fontSize * tag.name.length * 0.65 // fallback
      try {
        const prepared = prepare(tag.name, font)
        textW = measureNaturalWidth(prepared as any)
      } catch {
        // Canvas 不可用时使用估算值
      }
      const chipW = Math.ceil(textW) + PADDING_X * 2
      const chipH = fontSize + PADDING_Y * 2
      return { name: tag.name, fontSize, chipW, chipH }
    })

    // 行式布局
    const result: Chip[] = []
    const colors = getColors(isDark)
    let x = 0
    let y = 0
    let rowH = 0

    measured.forEach(({ name, fontSize, chipW, chipH }) => {
      if (x + chipW > containerW && x > 0) {
        x = 0
        y += rowH + GAP_Y
        rowH = 0
      }
      result.push({
        name,
        x,
        y,
        w: chipW,
        h: chipH,
        fontSize,
        color: colors.bg,
      })
      x += chipW + GAP_X
      rowH = Math.max(rowH, chipH)
    })

    const totalH = y + rowH + 1
    setChips(result)
    setCanvasSize({ w: containerW, h: totalH })
  }, [tags, isDark])

  // 绘制 Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || chips.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvasSize.w * dpr
    canvas.height = canvasSize.h * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h)
    const colors = getColors(isDark)

    chips.forEach(chip => {
      // 直角背景
      ctx.beginPath()
      ctx.rect(chip.x, chip.y, chip.w, chip.h)
      ctx.fillStyle = colors.bg
      ctx.fill()

      // 粗边框
      ctx.lineWidth = 3
      ctx.strokeStyle = colors.border
      ctx.stroke()

      // 文字
      ctx.font = `900 ${chip.fontSize}px "Inter", "Montserrat", "Noto Sans SC", sans-serif`
      ctx.fillStyle = colors.text
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(chip.name.toUpperCase(), chip.x + chip.w / 2, chip.y + chip.h / 2)
    })
  }, [chips, canvasSize, isDark])

  // hover 效果
  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const hit = chips.find(c => mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h)
    canvasRef.current!.style.cursor = hit ? 'pointer' : 'default'
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const hit = chips.find(c => mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h)
    if (!hit) return
    if (onTagClick) onTagClick(hit.name)
    else navigate(`/tags/${hit.name}`)
  }

  if (tags.length === 0) return null

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        style={{ width: '100%', height: canvasSize.h, display: 'block' }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
    </div>
  )
}

export default TagCloud
