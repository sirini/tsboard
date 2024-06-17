/**
 * server/index
 *
 * 웹서버 진입점, 클라이언트에서는 @elysiajs/eden을 이용하여 App 접근
 */
import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { auth } from "./routers/auth"
import { admin } from "./routers/admin"
import { user } from "./routers/user"
import { home } from "./routers/home"
import { board } from "./routers/board"
import { sitemap } from "./routers/sitemap"
import { blog } from "./routers/blog"
import { sync } from "./routers/sync"
import { TSBOARD } from "../tsboard.config"

const app = new Elysia()
  .use(cors())
  .group("/tsapi", (app) => {
    return app.use(auth).use(admin).use(home).use(user).use(board).use(sitemap).use(blog).use(sync)
  })
  .listen(TSBOARD.SITE.API_PORT)

export type App = typeof app

console.log(
  `🚀 TSBOARD ${TSBOARD.VERSION} is running on ${app.server?.hostname}:${app.server?.port}`,
)
