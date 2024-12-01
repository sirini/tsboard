/**
 * server/index
 *
 * 웹서버 진입점, 클라이언트에서는 @elysiajs/eden을 이용하여 App 접근
 */
import { cors } from "@elysiajs/cors"
import { Elysia } from "elysia"
import { TSBOARD } from "../tsboard.config"
import { admin } from "./routers/admin"
import { auth } from "./routers/auth"
import { blogRssRouter } from "./routers/blog"
import { board } from "./routers/board"
import { commentRouter } from "./routers/comment"
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
      .use(board)
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
