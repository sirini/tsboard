import { Elysia } from "elysia"
import { listRouter } from "./home/list"
import { notificationRouter } from "./home/notification"
import { sidebarRouter } from "./home/sidebar"
import { visitRouter } from "./home/visit"

export const home = new Elysia().group("/home", (app) => {
  return app.use(visitRouter).use(notificationRouter).use(sidebarRouter).use(listRouter)
})
