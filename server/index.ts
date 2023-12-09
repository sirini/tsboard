import { Elysia } from "elysia"
import { auth } from "../server/routers/auth"

export const app = new Elysia()
  .group("/api", (app) => {
    return app.use(auth)
  })
  .listen(process.env.SERVER_PORT ?? 3100)

console.log(`TSBOARD [server] is running at ${app.server?.hostname}:${app.server?.port}`)
