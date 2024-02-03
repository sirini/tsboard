/**
 * server/routers/admin/group/general
 *
 * 특정 그룹과 관련된 라우팅 처리
 */

import { Elysia } from "elysia"
import { load } from "./general/load"
import { update } from "./general/update"

export const general = new Elysia().group("/general", (app) => {
  return app.use(load).use(update)
})
