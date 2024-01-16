import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [
    vue({}),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      manifest: {
        name: 'delivery-driver',
        short_name: 'delivery-driver',
        icons: [
          {
            src: './img/icons/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './img/icons/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        start_url: './index.html',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#4DBA87'
      },
      workbox: {
        cleanupOutdatedCaches: false
      }
    }),
    federation({
      name: 'delivery-system-driver',
      remotes: {
        'delivery-system-service': 'http://192.168.1.19:5174/assets/remoteEntry.js'
      },
      shared: ['vue']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
