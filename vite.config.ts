import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['lenis', 'gsap', '@gsap/react']
  },
  build: {
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'gsap-vendor': ['gsap', '@gsap/react'],
          'three-core': ['three'],
          'three-bindings': ['@react-three/fiber', '@react-three/drei'],
          'ui-vendor': ['lucide-react', 'react-icons'],
          'smooth-scroll': ['lenis'],
        },
      },
    },
  },
})
