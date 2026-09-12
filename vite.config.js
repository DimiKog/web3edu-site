import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

const shouldAnalyze = process.env.ANALYZE === "true";

/**
 * Inject a production preload for the public Hero LIGHT logo.
 * Resolves the hashed asset from the build bundle (same file Hero.jsx imports).
 * Dev uses the source path Vite already serves.
 */
function preloadHeroLightLogo() {
  const DEV_HREF = "/src/assets/web3edu_logo_light.webp";
  const isLightLogoAsset = (fileName) =>
    typeof fileName === "string" &&
    fileName.includes("web3edu_logo_light") &&
    fileName.endsWith(".webp");

  const preloadTag = (href) =>
    `<link rel="preload" as="image" href="${href}" fetchpriority="high" />`;

  return {
    name: "preload-hero-light-logo",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (html.includes("web3edu_logo_light") && html.includes('rel="preload"')) {
          return html;
        }

        let href = DEV_HREF;
        if (ctx.bundle) {
          const asset = Object.values(ctx.bundle).find(
            (item) => item?.type === "asset" && isLightLogoAsset(item.fileName)
          );
          if (!asset?.fileName) return html;
          href = `/${asset.fileName}`.replace(/\/{2,}/g, "/");
        }

        return html.replace(/\n?\s*<\/head>/i, `\n    ${preloadTag(href)}\n  </head>`);
      },
    },
  };
}

const REACT_VENDOR_PACKAGES = new Set([
  "react",
  "react-dom",
  "react-router",
  "react-router-dom",
  "scheduler",
]);

const WEB3_VENDOR_PACKAGES = new Set([
  "wagmi",
  "viem",
  "ethers",
  "@rainbow-me/rainbowkit",
]);

const getPackageName = (id) => {
  const parts = id.split("node_modules/");
  if (parts.length < 2) return null;
  const pkgPath = parts[parts.length - 1];
  const segments = pkgPath.split("/");
  if (!segments[0]) return null;
  if (segments[0].startsWith("@") && segments[1]) return `${segments[0]}/${segments[1]}`;
  return segments[0];
};

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    preloadHeroLightLogo(),
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
        deps.filter((dep) => !dep.includes("vendor-web3"))
    },
    rollupOptions: {
      external: ["dao-invite"],
      output: {
        manualChunks(id) {
          if (id.includes("vite/preload-helper")) return "vendor-react";
          if (!id.includes("node_modules")) return;
          const pkg = getPackageName(id);
          if (!pkg) return;

          // Keep React/runtime internals in the public entry vendor chunk.
          if (REACT_VENDOR_PACKAGES.has(pkg)) return "vendor-react";

          // Shared keccak used by public address normalize AND by viem/ethers.
          // Must NOT land inside vendor-web3 or the public entry will import that chunk.
          // Do not put @noble/curves here — that would pull web3 curve code onto `/`.
          if (pkg === "@noble/hashes") return "vendor-noble";

          // Keep wallet/web3 dependencies split so only web3 routes request them.
          if (WEB3_VENDOR_PACKAGES.has(pkg)) return "vendor-web3";
        }
      }
    }
  },

  // Ensure Vite dev server ignores all files inside these folders
  server: {
    port: 5173,
    strictPort: true,
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
