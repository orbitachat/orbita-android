import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'zustand', 'framer-motion'],
          'vendor-ui': ['lucide-react', 'i18next', 'react-i18next'],
          'vendor-network': ['@supabase/supabase-js', 'ably', 'pusher-js', 'livekit-client'],
          'vendor-crypto': ['@stablelib/x25519', '@stablelib/sha256', '@stablelib/hkdf', 'crypto-js'],
          'vendor-emoji': ['@emoji-mart/data'],
        },
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
})