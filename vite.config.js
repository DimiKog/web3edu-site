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
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !dep.includes("web3-vendor"))
    },
    rollupOptions: {
      external: ["dao-invite"],
      output: {
        manualChunks(id) {
          if (
            id.includes("vite/preload-helper") ||
            id.includes("modulepreload-polyfill")
          ) {
            return "react-vendor";
          }

          if (!id.includes("node_modules")) return;

          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router/") ||
            id.includes("/react-router-dom/")
          ) {
            return "react-vendor";
          }

          if (
            id.includes("/wagmi/") ||
            id.includes("/viem/") ||
            id.includes("/ethers/") ||
            id.includes("/@rainbow-me/")
          ) {
            return "web3-vendor";
          }

          if (
            id.includes("/react-icons/") ||
            id.includes("/lucide-react/") ||
            id.includes("/qrcode.react/") ||
            id.includes("/react-qr-code/")
          ) {
            return "ui-vendor";
          }
        }
      }
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
