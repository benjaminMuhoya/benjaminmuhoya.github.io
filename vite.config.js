import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        research: resolve(__dirname, "research/index.html"),
        projects: resolve(__dirname, "projects/index.html"),
        publications: resolve(__dirname, "publications/index.html"),
        gallery: resolve(__dirname, "gallery/index.html"),
      },
    },
  },
});
