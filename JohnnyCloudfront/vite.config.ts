import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks only - let Vite handle page splitting automatically
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'chart-vendor': ['recharts'],
        }
      }
    },
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging
    sourcemap: false,
    // Optimize for production
    minify: 'esbuild',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'recharts'
    ]
  }
})
