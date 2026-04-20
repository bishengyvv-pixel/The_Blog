---
title: Vite 6 性能优化实战
date: 2024-12-18
category: 前端开发
tags: ["Vite", "前端", "性能优化"]
summary: Vite 6 项目性能优化全攻略，从构建配置、依赖优化、代码分割等多个维度提升开发和生产环境性能。
---

# Vite 6 性能优化实战

Vite 虽然本身已经很快，但在大型项目中仍有很多可以优化的空间。

## 开发环境优化

### 依赖预构建优化
```ts
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['lodash', 'antd'], // 预构建常用依赖
    exclude: ['my-custom-package'] // 排除不需要预构建的包
  }
})
```

### 热更新优化
- 合理使用 `import.meta.hot` 边界
- 避免不必要的全局重渲染
- 使用 `server.hmr.partial` 配置提升更新效率

## 生产环境优化

### 代码分割
```ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['antd', '@ant-design/icons']
        }
      }
    }
  }
})
```

### 资源压缩
- 启用 gzip/brotli 压缩
- 图片资源优化
- 移除未使用的代码（Tree Shaking）

通过这些优化手段，可以将大型 Vite 项目的构建速度提升 30% 以上，首屏加载速度提升 50%。
