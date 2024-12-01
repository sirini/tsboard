import { Elysia } from "elysia"
import { updatePasswordRouter } from "./user/changepassword"
import { loadInfoRouter } from "./user/loadinfo"
import { loadPermissionRouter } from "./user/loadpermission"
import { manageUserRouter } from "./user/manageuser"
import { reportRouter } from "./user/report"

export const userRouter = new Elysia().group("/user", (app) => {
  return app.use(manageUserRouter)
    .use(loadInfoRouter)
    .use(reportRouter)
    .use(updatePasswordRouter)
    .use(loadPermissionRouter)
})
