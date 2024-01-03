/**
 * server/routers/admin
 *
 * 관리화면에 연관된 라우팅 처리
 */

import { Elysia } from "elysia"
import { board } from "./admin/board"

export const admin = new Elysia().group("/admin", (app) => {
  return app.use(board)
})
