import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages: https://kuroi1998.github.io/angie-scientific/
  base: '/angie-scientific/',
})
