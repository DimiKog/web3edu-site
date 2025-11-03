import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // or '/' if deploying to custom domain
  plugins: [react()],
});
