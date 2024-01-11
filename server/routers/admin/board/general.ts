/**
 * server/routers/admin/board/general
 *
 * 게시판 관리화면 > 일반 부분 처리
 */

import { Elysia } from "elysia"
import { load } from "./general/load"
import { update } from "./general/update"

export const general = new Elysia().group("/general", (app) => {
  return app.use(load).use(update)
})
