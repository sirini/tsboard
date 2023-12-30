/**
 * server/index.ts
 *
 * 웹서버 진입점, 클라이언트에서는 @elysiajs/eden을 이용하여 App 접근
 */
import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { auth } from "../server/routers/auth"

const app = new Elysia()
  .use(cors())
  .group("/api", (app) => {
    return app.use(auth)
  })
  .listen(process.env.SERVER_PORT)

export type App = typeof app

console.log(`TSBOARD [server] is running at ${app.server?.hostname}:${app.server?.port}`)
