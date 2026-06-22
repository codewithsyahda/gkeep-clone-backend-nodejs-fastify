import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**/generated/**/*',
        'test/**/*',
        'src/common/config/**/*',
        'src/**/*.mock.ts',
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.{test,spec}.ts'],
          exclude: ['src/**/*.it.{test,spec}.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['src/**/*.it.{test,spec}.ts'],
          fileParallelism: false,
        },
      },
    ],
    setupFiles: ['./test/vitest.setup.ts'],
  },
  resolve: {
    tsconfigPaths: true,
  },
});
