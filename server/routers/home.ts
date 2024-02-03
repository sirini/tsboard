/**
 * server/routers/home
 *
 * 사용자 방문 기록 등 처리
 */

import { Elysia } from "elysia"
import { visit } from "./home/visit"

export const home = new Elysia().group("/home", (app) => {
  return app.use(visit)
})
