import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // All /tp-api/* requests are forwarded to Travelpayouts, solving CORS in dev.
      // Production: replace with a real backend proxy (Vercel Edge Function, etc.)
      '/tp-api': {
        target: 'https://api.travelpayouts.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tp-api/, ''),
      },
    },
  },
})
