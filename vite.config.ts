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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':   ['react', 'react-dom'],
          'vendor-motion':  ['framer-motion'],
          'vendor-charts':  ['recharts'],
          'vendor-radix':   [
            '@radix-ui/react-dialog',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
            '@radix-ui/react-popover',
            '@radix-ui/react-slot',
            '@radix-ui/react-separator',
            '@radix-ui/react-tooltip',
          ],
        },
      },
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
