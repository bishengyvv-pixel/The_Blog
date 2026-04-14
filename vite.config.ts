import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { rssPlugin } from './vite-plugin-rss'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    rssPlugin({
      siteUrl: 'https://example.com',
      siteTitle: '技术博客',
      siteDescription: '个人技术博客，记录前端、运维、JS 逆向、Python 等技术学习历程。',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor'
          }
        }
      }
    }
  },
  server: {
    port: 3000
  }
})
