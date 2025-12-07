import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ['**/*.stories.tsx', 'node_modules/**'],
    projects: [
      // Regular component tests
      {
        test: {
          name: 'components',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(dirname, './'),
    },
  },
});
