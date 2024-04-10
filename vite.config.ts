// Plugins
import vue from "@vitejs/plugin-vue"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"
import ViteFonts from "unplugin-fonts/vite"

// Utilities
import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"

// TSBOARD Configuration
import { LOCALHOST, PORT_DEV, PORT_DEV_VITE } from "./tsboard.config"

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
    "process.env": {},
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: PORT_DEV_VITE,
    proxy: {
      "/api": {
        target: `${LOCALHOST}:${PORT_DEV}`,
        changeOrigin: true,
      },
    },
  },
})
