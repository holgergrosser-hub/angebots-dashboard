import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function getGitRevision_() {
  try {
    // Lazy import to avoid issues in some environments
    const { execSync } = require('node:child_process')
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return null
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  define: {
    'import.meta.env.VITE_APP_REVISION': JSON.stringify(
      process.env.VITE_APP_REVISION ||
        process.env.COMMIT_REF ||
        process.env.VERCEL_GIT_COMMIT_SHA ||
        getGitRevision_() ||
        'dev'
    ),
    'import.meta.env.VITE_APP_BUILD_TIME': JSON.stringify(
      process.env.VITE_APP_BUILD_TIME || new Date().toISOString()
    )
  },
  
  build: {
    // WICHTIG: esbuild statt terser verwenden!
    minify: 'esbuild',
    
    outDir: 'dist',
    sourcemap: false,
    
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  
  server: {
    port: 3000,
    open: true
  }
})
