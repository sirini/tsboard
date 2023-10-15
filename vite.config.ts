// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import ViteFonts from "unplugin-fonts/vite";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

/**
 * TSBOARD 클라이언트쪽 설정 파일
 * 서버쪽 설정은 .env 파일 참조
 * 
 * 참조1 - 사용하는 서버 환경이나 도메인에 따라 아래 설정들은 변경 필요함
 * 참조2 - 실제 운영되는 서버에 배포 전 IS_DEV는 반드시 false 변경 후 build
 */
const IS_DEV = true
const VITE_PORT = 3000
const SERVER_PORT = 3100 // .env 와 동일하게 유지
const DEV_API_PATH = `http://localhost:${SERVER_PORT}/tsapi`
const PROD_API_PATH = `https://tsboard.dev/tsapi`
const API = IS_DEV ? DEV_API_PATH : PROD_API_PATH

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
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
  } },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: VITE_PORT,
  },
});
