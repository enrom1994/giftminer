import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Important for GitHub Pages deployment:
  base: '/giftminer/', // Ensure this matches your GitHub repository name exactly
  build: {
    outDir: 'dist', // Default build output directory
  },
  optimizeDeps: {
    // This helps Vite pre-bundle and resolve Firebase modules correctly
    include: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
  },
});