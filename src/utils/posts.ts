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

export interface Post {
  meta: PostMeta
  content: string
}

