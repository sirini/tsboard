import { Elysia } from "elysia"
import { common } from "./report/common"

export const report = new Elysia().group("/report", (app) => {
  return app.use(common)
})
