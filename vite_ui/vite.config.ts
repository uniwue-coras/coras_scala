/// <reference types="vitest" />
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
  },
  server: {
    port: 5116
  },
  plugins: [
    react(),
    checker({
      typescript: true
    })
  ]
});
