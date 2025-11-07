import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // penting supaya asset path relatif
  build: {
    outDir: 'dist'
  }
})
