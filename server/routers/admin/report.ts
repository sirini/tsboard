/**
 * server/routers/admin/report
 *
 * 신고하기 화면과 관련된 라우팅 처리
 */

import { Elysia } from "elysia"
import { common } from "./report/common"

export const report = new Elysia().group("/report", (app) => {
  return app.use(common)
})
