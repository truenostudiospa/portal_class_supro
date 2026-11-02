import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'SportAcademy',
        short_name: 'SportAcademy',
        description: 'Cursos online para potenciar tu deporte.',
        theme_color: '#f97316',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // Navegaciones: red primero (sirve index.html de la SPA) y, sin conexión,
            // la última versión en caché o, si no existe, public/offline.html.
            urlPattern: ({ request, url }) =>
              request.mode === 'navigate' && !/\.(?:mp4|webm)$/i.test(url.pathname),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 30 },
              precacheFallback: { fallbackURL: '/offline.html' },
            },
          },
          {
            urlPattern: /^https:\/\/images\.picsum\.photos\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'course-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
        navigateFallback: null,
      },
    }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
