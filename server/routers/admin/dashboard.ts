/**
 * server/routers/admin/home
 *
 * 관리화면 첫페이지와 관련된 라우팅 처리
 */

import { Elysia } from "elysia"
import { general } from "./dashboard/general"

export const dashboard = new Elysia().group("/dashboard", (app) => {
  return app.use(general)
})
