import { defineConfig } from 'vitest/config'

// Standalone on purpose: the tests only cover pure TypeScript, so no Vite
// plugins are needed here. That also means no Vite plugin types are shared
// between this file and vite.config.ts.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
