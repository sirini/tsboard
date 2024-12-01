/**
 * server/routers/user
 *
 * 회원 관리, 쪽지, 신고 등의 라우팅 처리
 */

import { Elysia } from "elysia"
import { updatePasswordRouter } from "./user/changepassword"
import { chatRouter } from "./user/chat"
import { manageUserRouter } from "./user/manageuser"
import { reportRouter } from "./user/report"
import { userInfoRouter } from "./user/userinfo"

export const user = new Elysia().group("/user", (app) => {
  return app.use(manageUserRouter)
    .use(userInfoRouter)
    .use(chatRouter)
    .use(reportRouter)
    .use(updatePasswordRouter)
})
