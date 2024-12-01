/**
 * server/routers/auth/signup
 *
 * 신규 회원 가입하기 처리
 */

import { Elysia, t } from "elysia"
import {
  isDuplicatedEmail,
  isDuplicatedName
} from "../../database/auth/signup"
import { fail, success } from "../../util/tools"

export const checkEmailNameRouter = new Elysia()
  .post(
    "/checkemail",
    async ({ body: { email } }) => {
      const response = ""
      if ((await isDuplicatedEmail(email.trim())) === true) {
        return fail(`Duplicated email address.`, response)
      }
      return success(response)
    },
    {
      body: t.Object({
        email: t.String(),
      }),
    },
  )
  .post(
    "/checkname",
    async ({ body: { name, userUid } }) => {
      const response = ""
      if ((await isDuplicatedName(userUid, name.trim())) === true) {
        return fail(`Duplicated name.`, response)
      }
      return success(response)
    },
    {
      body: t.Object({
        name: t.String(),
        userUid: t.Number(),
      }),
    },
  )