import { Elysia } from "elysia"
import { downloadRouter } from "./board/download"
import { galleryRouter } from "./board/gallery"
import { likeRouter } from "./board/like"
import { listRouter } from "./board/list"
import { moveRouter } from "./board/move"
import { removePostRouter } from "./board/removepost"
import { viewRouter } from "./board/view"

export const boardRouter = new Elysia().group("/board", (app) => {
  return app.use(listRouter)
    .use(viewRouter)
    .use(galleryRouter)
    .use(downloadRouter)
    .use(moveRouter)
    .use(likeRouter)
    .use(removePostRouter)
    
})
