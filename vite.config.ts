import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['lenis', 'gsap', '@gsap/react']
  },
  esbuild: {
    // Console/debugger calls ship a surprising amount of string data and cost
    // real time inside animation loops on low-end devices.
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'gsap-vendor': ['gsap', '@gsap/react'],
          'ui-vendor': ['lucide-react', 'react-icons'],
          'smooth-scroll': ['lenis'],
          // Isolate the 3D stack so it caches independently and never lands in
          // a section chunk that would otherwise be small.
          'three-vendor': ['three'],
          'r3f-vendor': ['@react-three/fiber', '@react-three/drei'],
          'contour-vendor': ['d3-contour', 'd3-array'],
        },
      },
    },
  },
})
