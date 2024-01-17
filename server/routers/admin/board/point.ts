/**
 * server/routers/admin/board/point
 *
 * 게시판 관리화면 > 포인트 부분 처리
 */

import { Elysia } from "elysia"
import { load } from "./point/load"
import { update } from "./point/update"

export const point = new Elysia().group("/point", (app) => {
  return app.use(load).use(update)
})
