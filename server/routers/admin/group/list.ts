/**
 * server/routers/admin/group/list
 *
 * 그룹 목록과 관련된 라우팅 처리
 */

import { Elysia } from "elysia"
import { load } from "./list/load"
import { update } from "./list/update"

export const list = new Elysia().group("/list", (app) => {
  return app.use(load).use(update)
})
