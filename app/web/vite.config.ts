import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sentryVitePlugin({
      org: 'p6n',
      project: 'supernotion',
    }),
  ],

  resolve: {
    alias: {
      '@editor': path.resolve(__dirname, './src/components/editor'),
      '@draw': path.resolve(__dirname, './src/components/draw'),
      '@ui': path.resolve(__dirname, './src/primitive/ui'),
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    sourcemap: true,
  },
});
