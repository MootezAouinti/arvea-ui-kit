import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@arvea-ui/components': path.resolve(__dirname, '../../packages/components/src/index.ts'),
      '@arvea-ui/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    },
  },
});
