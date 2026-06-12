import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

const env = {}
try {
  readFileSync('.env', 'utf8').split('\n').forEach(line => {
    const [k, v] = line.split('=')
    if (k && v) env[k.trim()] = v.trim()
  })
} catch {}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/chat': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: () => '/v1/messages',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('x-api-key', env.ANTHROPIC_API_KEY || '')
            proxyReq.setHeader('anthropic-version', '2023-06-01')
            proxyReq.setHeader('content-type', 'application/json')
          })
        }
      }
    }
  }
})
