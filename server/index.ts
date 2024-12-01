import { cors } from "@elysiajs/cors"
import { Elysia } from "elysia"
import { TSBOARD } from "../tsboard.config"
import { admin } from "./routers/admin"
import { auth } from "./routers/auth"
import { blogRssRouter } from "./routers/blog"
import { boardRouter } from "./routers/board"
import { chatRouter } from "./routers/chat"
import { commentRouter } from "./routers/comment"
import { editorRouter } from "./routers/editor"
import { homeRouter } from "./routers/home"
import { seoRouter } from "./routers/seo"
import { syncRouter } from "./routers/sync"
import { userRouter } from "./routers/user"

const app = new Elysia()
  .use(cors())
  .group("/tsapi", (app) => {
    return app.use(auth)
      .use(admin)
      .use(homeRouter)
      .use(userRouter)
      .use(boardRouter)
      .use(editorRouter)
      .use(commentRouter)
      .use(seoRouter)
      .use(blogRssRouter)
      .use(syncRouter)
      .use(chatRouter)
  })
  .listen(TSBOARD.SITE.API_PORT)

export type App = typeof app

console.log(
  `🚀 TSBOARD ${TSBOARD.VERSION} is running on ${app.server?.hostname}:${app.server?.port}`,
)
