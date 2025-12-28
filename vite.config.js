import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/incident': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/incidents': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true
      }
    }
  },
  define: {
    'process.env': process.env
  }
})
