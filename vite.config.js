import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Infer repo name for GitHub Pages if available, fallback to previous value
function resolveBase() {
  // Em desenvolvimento, sempre usa /
  if (process.env.NODE_ENV !== 'production') return '/'
  
  // Se estiver no Netlify, usa /
  if (process.env.NETLIFY || process.env.NETLIFY_DEV) return '/'
  
  // Se tiver variável de ambiente VITE_BASE_PATH, usa ela
  if (process.env.VITE_BASE_PATH) return process.env.VITE_BASE_PATH
  
  // Para GitHub Pages, tenta inferir do repositório
  const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1]
  if (repo) return `/${repo}/`
  
  // Fallback: usa / para Netlify e outros serviços
  return '/'
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

