import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://stocks-sgv3.onrender.com',
        changeOrigin: true,
      },
      '/stock': {
        target: 'https://stocks-sgv3.onrender.com',
        changeOrigin: true,
      },
      '/news': {
        target: 'https://stocks-sgv3.onrender.com',
        changeOrigin: true,
      },
      '/watchlist': {
        target: 'https://stocks-sgv3.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
