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
      siteUrl: 'https://blog.bisheng.online',
      siteTitle: 'The_Blog',
      siteDescription: 'The_Blog is a personal blog about web development, programming, and technology.',
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
