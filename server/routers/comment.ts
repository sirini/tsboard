/**
 * server/routers/comment
 *
 * 댓글에 대한 여러 라우팅 처리
 */

import { Elysia } from "elysia"
import { comment } from "./comment/comment"

export const commentRouter = new Elysia().group("/comment", (app) => {
  return app.use(comment)
})
