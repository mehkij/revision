import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../media", // so VSCode extension can load it
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        entryFileNames: `assets/index.js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
