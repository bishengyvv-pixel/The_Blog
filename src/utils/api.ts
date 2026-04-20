/**
 * API 客户端 - 对接后端服务
 */

import type { Post, PostMeta } from './posts'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * 获取文章列表
 */
export async function fetchPosts(includeDrafts = false): Promise<PostMeta[]> {
  const url = new URL(`${API_BASE}/posts`)
  if (includeDrafts) url.searchParams.set('drafts', 'true')

  const res = await fetch(url)
  const json: ApiResponse<PostMeta[]> = await res.json()

  if (!json.success || !json.data) {
    throw new Error(json.error || '获取文章列表失败')
  }

  return json.data
}

/**
 * 获取单篇文章
 */
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_BASE}/posts/${encodeURIComponent(slug)}`)
  const json: ApiResponse<Post> = await res.json()

  if (!json.success) {
    if (res.status === 404) return null
    throw new Error(json.error || '获取文章失败')
  }

  return json.data || null
}

/**
 * 健康检查
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' })
    return res.ok
  } catch {
    return false
  }
}
