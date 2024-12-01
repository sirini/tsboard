import { cors } from "@elysiajs/cors"
import { Elysia } from "elysia"
import { TSBOARD } from "../tsboard.config"
import { admin } from "./routers/admin"
import { auth } from "./routers/auth"
import { blogRssRouter } from "./routers/blog"
import { boardRouter } from "./routers/board"
import { commentRouter } from "./routers/comment"
import { editorRouter } from "./routers/editor"
import { home } from "./routers/home"
import { sitemapRouter } from "./routers/sitemap"
import { syncRouter } from "./routers/sync"
import { user } from "./routers/user"

const app = new Elysia()
  .use(cors())
  .group("/tsapi", (app) => {
    return app.use(auth)
      .use(admin)
      .use(home)
      .use(user)
      .use(boardRouter)
      .use(editorRouter)
      .use(commentRouter)
      .use(sitemapRouter)
      .use(blogRssRouter)
      .use(syncRouter)
  })
  .listen(TSBOARD.SITE.API_PORT)

export type App = typeof app

console.log(
  `🚀 TSBOARD ${TSBOARD.VERSION} is running on ${app.server?.hostname}:${app.server?.port}`,
)
