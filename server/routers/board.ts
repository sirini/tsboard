/**
 * server/routers/board
 *
 * 게시판 동작과 관련된 여러 라우팅 처리
 */

import { Elysia } from "elysia"
import { list } from "./board/list"
import { view } from "./board/view"
import { comment } from "./board/comment"

export const board = new Elysia().group("/board", (app) => {
  return app.use(list).use(view).use(comment)
})
