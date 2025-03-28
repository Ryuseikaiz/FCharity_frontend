import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'https://fcharity.azurewebsites.net', // 🔥 Đổi URL backend chính xác
        changeOrigin: true,
        secure: true, // 🔥 Bật SSL nếu backend hỗ trợ HTTPS
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
