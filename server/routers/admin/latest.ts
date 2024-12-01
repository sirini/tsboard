import { Elysia } from "elysia"
import { comment } from "./latest/general/comment"
import { post } from "./latest/general/post"

export const latest = new Elysia().group("/latest", (app) => {
  return app.use(post).use(comment)
})
