import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

const shouldAnalyze = process.env.ANALYZE === "true";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      deleteOriginFile: false,
    }),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      deleteOriginFile: false,
    }),
    shouldAnalyze &&
      visualizer({
        filename: "dist/stats.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: "treemap",
      }),
  ].filter(Boolean),

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
    // Keep warning signal useful: still warns on large chunks, but avoids noise
    chunkSizeWarningLimit: 700,

    // Use esbuild to strip console statements in production (faster than terser)
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'],  // Remove console.* and debugger statements
    },

    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !dep.includes("web3-vendor"))
    },
    rollupOptions: {
      external: ["dao-invite"],
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-web3": [
            "wagmi",
            "viem",
            "ethers",
            "@rainbow-me/rainbowkit"
          ]
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
