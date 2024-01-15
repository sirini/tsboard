/**
 * server/routers/admin/board
 *
 * 게시판 관리화면과 관련된 라우팅 처리
 */

import { Elysia } from "elysia"
import { general } from "./board/general"
import { permission } from "./board/permission"

export const board = new Elysia().group("/board", (app) => {
  return app.use(general).use(permission)
})
