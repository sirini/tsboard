/**
 * server/routers/admin/home/general
 *
 * 관리화면 첫페이지 > 일반 라우팅 처리
 */

import { Elysia } from "elysia"
import { statistic } from "./general/statistic"
import { latest } from "./general/latest"
import { item } from "./general/item"

export const general = new Elysia().group("/general", (app) => {
  return app.use(statistic).use(latest).use(item)
})
