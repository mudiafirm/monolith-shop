import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.49.2',
        changeOrigin: true,
        headers: {
          Host: 'shop.local',
        },
      },
    },
  },
})
