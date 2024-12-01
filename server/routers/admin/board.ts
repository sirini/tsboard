import { Elysia } from "elysia"
import { general } from "./board/general"
import { permission } from "./board/permission"
import { point } from "./board/point"

export const board = new Elysia().group("/board", (app) => {
  return app.use(general).use(permission).use(point)
})
