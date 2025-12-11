import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base: "./"' ensures assets (js/css) are linked relatively, 
  // which is required for GitHub Pages project repositories (e.g. username.github.io/repo-name)
  base: './', 
})