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
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'chart-vendor': ['recharts'],
          
          // Feature chunks
          'pages': [
            './src/pages/Home.tsx',
            './src/pages/About.tsx',
            './src/pages/Metrics.tsx',
            './src/pages/Guardrails.tsx',
            './src/pages/WhyAws.tsx',
            './src/pages/FAQ.tsx',
            './src/pages/Login.tsx'
          ],
          'components': [
            './src/components/AWSChatBot.tsx',
            './src/components/InteractiveMigrationPlanner.tsx',
            './src/components/BusinessImpactStatements.tsx',
            './src/components/CustomerScenarios.tsx',
            './src/components/SavingsCalculator.tsx',
            './src/components/ClickableBenefits.tsx',
            './src/components/TeamProfileCard.tsx',
            './src/components/RoadmapTimeline.tsx',
            './src/components/OriginStory.tsx',
            './src/components/SecurityTrust.tsx'
          ],
          'charts': [
            './src/components/charts/SpendTrendChart.tsx',
            './src/components/charts/SecurityFindingsChart.tsx'
          ],
          'utils': [
            './src/lib/plannerStore.ts',
            './src/lib/metricsUtils.ts',
            './src/lib/chatStore.ts',
            './src/lib/audio/AudioManager.ts'
          ]
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
