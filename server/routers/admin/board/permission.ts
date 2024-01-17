/**
 * server/routers/admin/board/permission
 *
 * 게시판 관리화면 > 권한 부분 처리
 */

import { Elysia } from "elysia"
import { load } from "./permission/load"
import { update } from "./permission/update"

export const permission = new Elysia().group("/permission", (app) => {
  return app.use(load).use(update)
})
