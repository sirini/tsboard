import { Elysia } from "elysia"
import { listRouter } from "./home/latest"
import { sidebarRouter } from "./home/sidebar"
import { tsboardTestRouter } from "./home/tsboard"
import { visitRouter } from "./home/visit"

export const homeRouter = new Elysia().group("/home", (app) => {
  return app.use(visitRouter).use(sidebarRouter).use(listRouter).use(tsboardTestRouter)
})
