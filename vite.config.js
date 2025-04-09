import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
