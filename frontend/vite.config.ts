// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // Run: npm i -D @types/node if 'path' shows a TS error

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // 👈 This forces Vite to use a single copy of React
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    proxy: {
      // Redirects http://localhost:5173/api -> http://localhost:5000/api
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },  }
});
