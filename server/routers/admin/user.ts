import { Elysia } from "elysia"
import { list } from "./user/list"
import { modify } from "./user/modify"

export const user = new Elysia().group("/user", (app) => {
  return app.use(list).use(modify)
})
