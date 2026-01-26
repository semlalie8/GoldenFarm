import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        // Use service name 'server' for Docker, 'localhost' for local
        target: process.env.VITE_API_URL || 'http://server:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    global: 'window',
  },
  optimizeDeps: {
    // Pre-bundle EmailJS to avoid Vite ESM errors
    include: ['react-hot-toast', 'date-fns', 'framer-motion', '@emailjs/browser']
  }
})
