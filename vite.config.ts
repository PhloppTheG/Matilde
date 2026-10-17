import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' keeps asset URLs relative, so the build works on GitHub Pages
// under any repository name (https://<user>.github.io/<repo>/).
// Test settings live in vitest.config.ts.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
