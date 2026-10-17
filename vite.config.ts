/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// defineConfig comes from the project's own `vite` package (not from
// `vitest/config`), so plugin types always resolve to a single Vite copy.
// The triple-slash reference above only adds the `test` option to the type.
//
// base './' keeps asset URLs relative, so the build works on GitHub Pages
// under any repository name (https://<user>.github.io/<repo>/).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
