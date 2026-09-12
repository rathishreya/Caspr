import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['packages/**/*.test.ts', 'apps/**/*.test.ts'],
    // A test that reads the host clock or the host timezone is a test that passes in CI
    // and fails on somebody's laptop. Pinning it here makes that a build-level guarantee
    // rather than a convention.
    env: { TZ: 'UTC' },
  },
});
