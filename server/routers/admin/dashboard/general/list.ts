/**
 * server/routers/admin/home/general/list
 *
 * 관리화면 첫페이지의 그룹, 게시판, 회원 목록 최신순으로 가져오기
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

export const list = new Elysia().use(
  jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET_KEY!,
  }),
)
