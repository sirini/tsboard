/**
 * server/routers/user
 *
 * 회원 관리, 쪽지, 신고 등의 라우팅 처리
 */

import { Elysia } from "elysia"
import { manageUser } from "./user/manageuser"
import { userInfo } from "./user/userinfo"
import { chat } from "./user/chat"

export const user = new Elysia().group("/user", (app) => {
  return app.use(manageUser).use(userInfo).use(chat)
})
