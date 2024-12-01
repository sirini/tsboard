import { Elysia } from "elysia"
import { general } from "./group/general"
import { list } from "./group/list"

export const group = new Elysia().group("/group", (app) => {
  return app.use(general).use(list)
})
