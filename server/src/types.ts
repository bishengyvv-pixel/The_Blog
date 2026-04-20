/**
 * 文章元数据
 */
export interface PostMeta {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  draft: boolean
  summary?: string
  cover?: string
  updatedAt?: string
  top?: boolean
  series?: string
  seriesOrder?: number
}

/**
 * 文章完整数据
 */
export interface Post {
  meta: PostMeta
  content: string
}

/**
 * API 响应格式
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
