import express from 'express'
import cors from 'cors'
import { getAllPostsMeta, getPostBySlug } from './utils/posts.js'
import type { ApiResponse, Post, PostMeta } from './types.js'

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

/**
 * 获取文章列表
 * GET /api/posts
 */
app.get('/api/posts', async (req, res) => {
  try {
    const includeDrafts = req.query.drafts === 'true'
    const posts = await getAllPostsMeta(includeDrafts)

    const response: ApiResponse<PostMeta[]> = {
      success: true,
      data: posts,
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : '获取文章列表失败',
    }
    res.status(500).json(response)
  }
})

/**
 * 获取单篇文章
 * GET /api/posts/:slug
 */
app.get('/api/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const post = await getPostBySlug(slug)

    if (!post) {
      const response: ApiResponse<never> = {
        success: false,
        error: '文章不存在',
      }
      res.status(404).json(response)
      return
    }

    const response: ApiResponse<Post> = {
      success: true,
      data: post,
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : '获取文章失败',
    }
    res.status(500).json(response)
  }
})

/**
 * 健康检查
 * GET /api/health
 */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 处理
app.use((_req, res) => {
  res.status(404).json({ success: false, error: '接口不存在' })
})

app.listen(PORT, () => {
  console.log(`🚀 Blog API server running at http://localhost:${PORT}`)
  console.log(`📚 API endpoints:`)
  console.log(`   GET /api/posts      - 文章列表`)
  console.log(`   GET /api/posts/:slug - 单篇文章`)
  console.log(`   GET /api/health     - 健康检查`)
})
