import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  base: '/SodorAcademy/piano/',
  build: {
    outDir: '../dist-piano',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@piano-lib': path.resolve(__dirname, '../piano-lib/src'),
    },
  },
});
