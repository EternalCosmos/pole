import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@components': path.resolve('./src/components'),
    },
  },
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
});
