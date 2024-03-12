/**
 * server/routers/home
 *
 * 사용자 방문 기록 처리 라우팅
 */

import { Elysia } from "elysia"
import { visit } from "./home/visit"
import { notification } from "./home/notification"

export const home = new Elysia().group("/home", (app) => {
  return app.use(visit).use(notification)
})
