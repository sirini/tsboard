/**
 * server/routers/admin/group
 *
 * 특정 게시판 그룹과 관련된 라우팅 처리
 */

import { Elysia } from "elysia"
import { general } from "./group/general"

export const group = new Elysia().group("/group", (app) => {
  return app.use(general)
})
