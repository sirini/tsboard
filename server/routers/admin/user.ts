/**
 * server/routers/admin/user
 *
 * 회원 관리와 관련된 라우팅 처리
 */

import { Elysia } from "elysia"
import { list } from "./user/list"
import { modify } from "./user/modify"

export const user = new Elysia().group("/user", (app) => {
  return app.use(list).use(modify)
})
