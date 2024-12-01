/**
 * server/routers/board
 *
 * 게시판과 상호작용에 필요한 라우터들
 */

import { Elysia } from "elysia"
import { editor } from "./board/editor"
import { gallery } from "./board/gallery"
import { list } from "./board/list"
import { view } from "./board/view"

export const board = new Elysia().group("/board", (app) => {
  return app.use(list).use(view).use(editor).use(gallery)
})
