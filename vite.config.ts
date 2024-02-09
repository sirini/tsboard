// Plugins
import vue from "@vitejs/plugin-vue"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"
import ViteFonts from "unplugin-fonts/vite"

// Utilities
import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"

/**
 * TSBOARD 클라이언트쪽 설정 파일
 * 서버쪽 설정은 .env 파일 참조
 *
 * 매뉴얼 | https://github.com/sirini/tsboard
 * 문의 | https://tsboard.dev
 *
 */
const IS_DEV = true // [1]
const PREFIX = "" // [2]
const VITE_PORT = 3000 // [3]
const SERVER_PORT = 3100 // [4]
const MAX_FILE_SIZE = 10247680 // [5]
const DOMAIN = "localhost" // [6]
const DEV_API_PATH = `http://${DOMAIN}:${VITE_PORT}` // [7]
const PROD_API_PATH = `http://${DOMAIN}/api` // [8]
const API = IS_DEV ? DEV_API_PATH : PROD_API_PATH

//////////////////////////////////////////////////////
// 위의 내용만 수정하시고, 아래 내용은 그대로 두세요!
//////////////////////////////////////////////////////

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
      API,
      PREFIX,
      MAX_FILE_SIZE,
    },
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
      "/api": {
        target: `http://${DOMAIN}:${SERVER_PORT}`,
        changeOrigin: true,
      },
    },
  },
})
