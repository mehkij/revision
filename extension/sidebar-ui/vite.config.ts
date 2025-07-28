import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../media", // so VSCode extension can load it
    emptyOutDir: true,
    rollupOptions: {
      input: {
        auth: resolve(__dirname, "views/authView/index.html"),
        comments: resolve(__dirname, "views/commentsView/index.html"),
        createComment: resolve(__dirname, "views/createCommentView/index.html"),
      },
      output: {
        entryFileNames: `assets/[name]/index.js`,
        chunkFileNames: `assets/[name]/[name].js`,
        assetFileNames: `assets/[name]/[name].[ext]`,
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
