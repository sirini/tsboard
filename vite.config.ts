// Plugins
import vue from "@vitejs/plugin-vue"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"
import ViteFonts from "unplugin-fonts/vite"

// Utilities
import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"

// TSBOARD Configuration
import { TSBOARD } from "./tsboard.config"

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
  define: {
    "process.env": {
      API: TSBOARD.IS_DEVELOPING
        ? `${TSBOARD.API.DEVELOPING}:${TSBOARD.PORT.VITE}`
        : TSBOARD.API.PRODUCTION,
      PREFIX: TSBOARD.PREFIX,
      MAX_FILE_SIZE: TSBOARD.MAX_FILE_SIZE,
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: TSBOARD.PORT.VITE,
    proxy: {
      "/api": {
        target: `${TSBOARD.API.DEVELOPING}:${TSBOARD.PORT.DEVELOPING}`,
        changeOrigin: true,
      },
    },
  },
})
