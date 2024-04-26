import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  server: {
    port: 5116
  },
  plugins: [
    checker({
      typescript: true
    })
  ]
});
