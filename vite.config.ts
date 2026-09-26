import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

const DEV_API_URL = 'http://localhost:5080';
const DEV_PORT = 5173;

const fromSrc = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@core': fromSrc('core'),
      '@shared': fromSrc('shared'),
      '@features': fromSrc('features'),
    },
  },
  server: {
    port: DEV_PORT,
    strictPort: true,
    proxy: {
      '/api': {
        target: DEV_API_URL,
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    restoreMocks: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'app',
          include: ['src/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['./src/test-setup.ts'],
          css: false,
        },
      },
      {
        test: {
          name: 'scripts',
          include: ['scripts/**/*.test.mjs'],
          environment: 'node',
        },
      },
    ],
  },
});
