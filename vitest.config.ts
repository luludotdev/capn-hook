import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['**/node_modules', '**/build', '.idea', '.git', '.cache'],
    passWithNoTests: true,
  },
})
