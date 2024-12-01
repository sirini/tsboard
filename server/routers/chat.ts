import { Elysia } from "elysia"
import { historyRouter } from "./chat/history"
import { listRouter } from "./chat/list"
import { saveRouter } from "./chat/save"

export const chatRouter = new Elysia().group("/chat", (app) => {
  return app.use(listRouter).use(historyRouter).use(saveRouter)
})
