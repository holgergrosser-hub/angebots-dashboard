import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
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
