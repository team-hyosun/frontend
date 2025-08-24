import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'
import removeConsole from 'vite-plugin-remove-console'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    mkcert(),
    removeConsole(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Workout Video Recorder',
        short_name: 'ParkinCare',
        description: 'Record your workout videos with PWA functionality',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'parkin-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'parkin-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true,
    css: false,
    silent: true, // 기본 리포터 다 꺼버림
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    https: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://parkincare.com',
        changeOrigin: true,
        // 쿠키 세션 쓰면 로컬에서도 동작하도록 (선택)
        cookieDomainRewrite: 'localhost',
        cookiePathRewrite: '/',
      },
    },
  },
})
