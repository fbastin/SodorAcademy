import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  // Setting base to the subdirectory name for correct asset loading on slashbin.net
  base: '/SodorAcademy/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    proxy: {
      '/SodorAcademy/api': 'http://localhost:3000'
    }
  }
});
