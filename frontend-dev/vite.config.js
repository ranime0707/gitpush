import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Port par défaut pour Vite
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 🔁 Backend Express
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ✅ Pour importer depuis "@/components/..." etc.
    }
  }
});
