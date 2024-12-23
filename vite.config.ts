// Plugins
import vue from "@vitejs/plugin-vue"
import ViteFonts from "unplugin-fonts/vite"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

// Utilities
import { fileURLToPath, URL } from "node:url"
import * as sass from "sass"
import { defineConfig } from "vite"

// TSBOARD Configuration
import { IS_DEV, LOCALHOST, API_PORT, VITE_PORT, TSBOARD } from "./tsboard.config"

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
    ViteFonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
        ],
      },
    }),
  ],
  base: IS_DEV ? "" : TSBOARD.PREFIX.length > 0 ? TSBOARD.PREFIX : "/",
  define: {
    "process.env": {},
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: VITE_PORT,
    proxy: {
      /* 쿠키가 정상적으로 동작하려면, 반드시 proxy 설정으로 API 호출 필요 */
      "/goapi": {
        target: `${LOCALHOST}:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
        importers: [new sass.NodePackageImporter()],
      },
      sass: {
        api: "modern",
        importers: [new sass.NodePackageImporter()],
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
})
