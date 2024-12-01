import { Elysia } from "elysia"
import { notiCheckedRouter } from "./noti/checked"
import { notiLoadRouter } from "./noti/load"

export const notiRouter = new Elysia().group("/noti", (app) => {
  return app.use(notiLoadRouter).use(notiCheckedRouter)
})
