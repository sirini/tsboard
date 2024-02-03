/**
 * server/routers/admin/home/general/latest
 *
 * 관리화면 첫페이지의 최근 게시글, 댓글, 신고 내용 가져오기
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, updateAccessToken } from "../../../../util/tools"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

export const latest = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET_KEY!,
  }),
)
