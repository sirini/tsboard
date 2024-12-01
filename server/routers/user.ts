import { Elysia } from "elysia"
import { updatePasswordRouter } from "./user/changepassword"
import { manageUserRouter } from "./user/manageuser"
import { reportRouter } from "./user/report"
import { userInfoRouter } from "./user/userinfo"

export const user = new Elysia().group("/user", (app) => {
  return app.use(manageUserRouter)
    .use(userInfoRouter)
    .use(reportRouter)
    .use(updatePasswordRouter)
})
