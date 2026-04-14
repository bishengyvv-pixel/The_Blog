import { prepare, layout } from '@chenglou/pretext'

// 剥离 Markdown 语法，保留纯文字
function stripMarkdown(md: string): string {
  return md
    .replace(/^---[\s\S]*?---/, '')          // frontmatter
    .replace(/```[\s\S]*?```/g, ' CODE ')    // 代码块替换为占位符
    .replace(/`[^`]+`/g, ' ')               // 行内代码
    .replace(/!\[.*?\]\(.*?\)/g, ' ')       // 图片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接保留文字
    .replace(/^#{1,6}\s+/gm, '')            // 标题符号
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1') // 粗体/斜体
    .replace(/^\s*[-*+]\s+/gm, '')          // 列表符号
    .replace(/^\s*\d+\.\s+/gm, '')          // 有序列表
    .replace(/^\s*>\s+/gm, '')              // 引用
    .replace(/\n{3,}/g, '\n\n')             // 多余空行
    .trim()
}

// 统计代码块行数（单独折算阅读速度）
function countCodeLines(md: string): number {
  const blocks = md.match(/```[\s\S]*?```/g) || []
  return blocks.reduce((sum, b) => sum + b.split('\n').length - 2, 0)
}

export interface ReadingTimeResult {
  minutes: number
  label: string    // 如 "约 5 分钟"
  lineCount: number
  charCount: number
}

/**
 * 用 @chenglou/pretext 计算实际渲染行数，再估算阅读时长。
 *
 * @param markdown  文章原始 Markdown 文本
 * @param contentWidth  正文区域宽度（px），默认 680
 * @param font  正文字体（需与 CSS 一致），默认 '18px "Noto Serif SC"'
 * @param lineHeight  行高（px），默认 32（1.8 × 18px ≈ 32）
 */
export function estimateReadingTime(
  markdown: string,
  contentWidth = 680,
  font = '18px "Noto Serif SC"',
  lineHeight = 32,
): ReadingTimeResult {
  const plain = stripMarkdown(markdown)
  const charCount = plain.replace(/\s/g, '').length

  let lineCount = 0
  try {
    // pretext：不触碰 DOM 计算实际换行后行数
    const prepared = prepare(plain, font)
    const result = layout(prepared, contentWidth, lineHeight)
    lineCount = result.lineCount
  } catch {
    // SSR / Canvas 不可用时降级：按字符数估算行数
    const charsPerLine = Math.floor(contentWidth / 18)
    lineCount = Math.ceil(charCount / charsPerLine)
  }

  // 中文阅读速度 ~300字/分钟，代码行 ~5行/分钟
  const codeLines = countCodeLines(markdown)
  const textMinutes = lineCount > 0
    ? (charCount / 300)
    : (charCount / 300)
  const codeMinutes = codeLines / 5

  const minutes = Math.max(1, Math.ceil(textMinutes + codeMinutes))

  return {
    minutes,
    label: `约 ${minutes} 分钟`,
    lineCount,
    charCount,
  }
}
