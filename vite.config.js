import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],

  // Stop dependency optimizer from touching dao-invite or dist
  optimizeDeps: {
    exclude: [
      "@metamask/sdk",
      "@react-native-async-storage/async-storage",
      "dao-invite"
    ]
  },

  // Rollup cannot use wildcards → Just ignore the folder name
  build: {
    rollupOptions: {
      external: ["dao-invite"]
    }
  },

  // Ensure Vite dev server ignores all files inside these folders
  server: {
    watch: {
      ignored: [
        "**/dao-invite/**",
        "**/dist/**"
      ]
    },
    proxy: {
      "/api": {
        target: "http://localhost:8092",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },

  // Prevent import resolution for SDK modules
  resolve: {
    alias: {
      "dao-invite": false,
      "@react-native-async-storage/async-storage": false
    }
  }
});