import { Elysia } from "elysia"
import { general } from "./dashboard/general"

export const dashboard = new Elysia().group("/dashboard", (app) => {
  return app.use(general)
})
