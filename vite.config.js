import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Infer repo name for GitHub Pages if available, fallback to previous value
function resolveBase() {
  if (process.env.NODE_ENV !== 'production') return '/'
  const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1]
  if (repo) return `/${repo}/`
  return '/conectasaude/'
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001
  },
  base: resolveBase(),
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  }
})

