/**
 * server/routers/user
 *
 * 회원 관리, 쪽지, 신고 등의 라우팅 처리
 */

import { Elysia } from "elysia"
import { updatePassword } from "./user/changepassword"
import { chat } from "./user/chat"
import { manageUser } from "./user/manageuser"
import { report } from "./user/report"
import { userInfo } from "./user/userinfo"

export const user = new Elysia().group("/user", (app) => {
  return app.use(manageUser).use(userInfo).use(chat).use(report).use(updatePassword)
})
