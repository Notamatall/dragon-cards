import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "style/[name][extname]";
          }
          return "[name][extname]";
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  plugins: [react(), tsconfigPaths()],
});
