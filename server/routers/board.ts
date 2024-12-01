import { Elysia } from "elysia"
import { galleryRouter } from "./board/gallery"
import { likeRouter } from "./board/like"
import { listRouter } from "./board/list"
import { viewRouter } from "./board/view"
import { loadPostRouter } from "./editor/loadpost"

export const boardRouter = new Elysia().group("/board", (app) => {
  return app.use(listRouter)
    .use(viewRouter)
    .use(galleryRouter)
    .use(likeRouter)
    .use(loadPostRouter)
})
