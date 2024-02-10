/**
 * server/index.ts
 *
 * 웹서버 진입점, 클라이언트에서는 @elysiajs/eden을 이용하여 App 접근
 */
import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { auth } from "./routers/auth"
import { admin } from "./routers/admin"
import { user } from "./routers/user"
import { home } from "./routers/home"

const app = new Elysia()
  .use(cors())
  .group("/api", (app) => {
    return app.use(auth).use(admin).use(home).use(user)
  })
  .listen(process.env.SERVER_PORT ?? 3100)

export type App = typeof app

console.log(`🚀 tsboard.server is running at ${app.server?.hostname}:${app.server?.port}`)
