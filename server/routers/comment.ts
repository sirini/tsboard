/**
 * server/routers/comment
 *
 * 댓글에 대한 여러 라우팅 처리
 */

import { Elysia } from "elysia"
import { commentRouter } from "./comment/comment"

export const comment = new Elysia().group("/comment", (app) => {
  return app.use(commentRouter)
})
