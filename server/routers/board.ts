/**
 * server/routers/board
 *
 * 게시판과 상호작용에 필요한 라우터들
 */

import { Elysia } from "elysia"
import { editorRouter } from "./board/editor"
import { galleryRouter } from "./board/gallery"
import { listRouter } from "./board/list"
import { viewRouter } from "./board/view"

export const board = new Elysia().group("/board", (app) => {
  return app.use(listRouter).use(viewRouter).use(editorRouter).use(galleryRouter)
})
