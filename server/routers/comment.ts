/**
 * server/routers/comment
 *
 * 댓글에 대한 여러 라우팅 처리
 */

import { Elysia } from "elysia"
import { likeRouter } from "./comment/like"
import { listRouter } from "./comment/list"
import { modifyRouter } from "./comment/modify"
import { removeRouter } from "./comment/remove"
import { replyRouter } from "./comment/reply"
import { writeRouter } from "./comment/write"

export const commentRouter = new Elysia().group("/comment", (app) => {
  return app.use(listRouter)
    .use(likeRouter)
    .use(modifyRouter)
    .use(removeRouter)
    .use(replyRouter)
    .use(writeRouter)
})
