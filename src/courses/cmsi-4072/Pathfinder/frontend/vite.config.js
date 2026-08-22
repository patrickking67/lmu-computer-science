import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Ensure Vite serves from root
  server: {
    port: 5173, // Ensure correct port
    strictPort: true, // Prevent port conflicts
    proxy: {
      "/api": "http://localhost:5050", // Ensure backend runs on 5050
    },
  },
});
