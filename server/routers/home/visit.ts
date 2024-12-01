/**
 * server/routers/home/visit
 *
 * 사용자 방문 기록하기
 */

import { Elysia, t } from "elysia"
import { TSBOARD } from "../../../tsboard.config"
import { addAccessLog } from "../../database/home/visit"

export const visitRouter = new Elysia()
  .get(
    "/visit",
    async ({ query: { userUid } }) => {
      addAccessLog(userUid)
      return {}
    },
    {
      query: t.Object({
        userUid: t.Numeric(),
      }),
    },
  )
  .get("/tsboard", async () => {
    return {
      version: TSBOARD.VERSION,
      license: "MIT license (https://tsboard.dev/license)",
      git: "https://github.com/sirini/tsboard",
      tsboard: "https://tsboard.dev",
      thanksTo: {
        vscode: "https://code.visualstudio.com",
        eslint: "https://eslint.org",
        prettier: "https://prettier.io",
        typescript: "https://www.typescriptlang.org",
        vite: "https://vitejs.dev",
        mariadb: "https://mariadb.org",
        mysql2: "https://www.npmjs.com/package/mysql2",
        nginx: "https://www.nginx.com",
        bun: "https://bun.sh",
        chalk: "https://www.npmjs.com/package/chalk",
        nodemailer: "https://www.nodemailer.com",
        sharp: "https://sharp.pixelplumbing.com",
        elysia: "https://elysiajs.com",
        vue: "https://vuejs.org",
        vueRouter: "https://router.vuejs.org",
        pinia: "https://pinia.vuejs.org",
        vuetify: "https://vuetifyjs.com",
        tiptap: "https://tiptap.dev",
        highlightjs: "https://highlightjs.org",
        nanoid: "https://www.npmjs.com/package/nanoid",
        sanitizeHtml: "https://www.npmjs.com/package/sanitize-html",
        cryptoJs: "https://www.npmjs.com/package/crypto-js",
      },
    }
  })
