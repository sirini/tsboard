/**
 * server/routers/admin/latest
 *
 * 최근 글/댓글과 관련된 라우팅 처리
 */

import { Elysia } from "elysia"
import { post } from "./latest/general/post"

export const latest = new Elysia().group("/latest", (app) => {
  return app.use(post)
})
