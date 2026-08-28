import tailwindcss from "@tailwindcss/vite"
import vue from "@vitejs/plugin-vue"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"

import { DEV_SERVER, TSBOARD } from "./tsboard.config"

const apiTarget =
  process.env.TSBOARD_API_TARGET ?? `http://${DEV_SERVER.apiHost}:${DEV_SERVER.apiPort}`

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: TSBOARD.basePath,
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    port: DEV_SERVER.frontendPort,
    proxy: {
      [TSBOARD.apiBase]: {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/@tiptap/") || id.includes("/prosemirror-")) return "editor"
          if (id.includes("/reka-ui/") || id.includes("/lucide-vue-next/")) return "ui"
          return undefined
        },
      },
    },
  },
})
