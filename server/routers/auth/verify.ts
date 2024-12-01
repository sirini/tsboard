/**
 * server/routers/auth/signup
 *
 * 신규 회원 가입하기 처리
 */

import { Elysia, t } from "elysia"
import { TEXT } from "../../../src/messages/mail/welcome"
import {
  verify
} from "../../database/auth/signup"
import { sendMail } from "../../util/sendmail"
import { fail, success } from "../../util/tools"

export const verifyCodeRouter = new Elysia()
  .post(
    "/verify",
    async ({ body: { target, code, user, lang } }) => {
      const response = ""
      const result = await verify(target, code, user)
      if (result) {
        const subject = TEXT[lang].SUBJECT.replaceAll("#name#", user.name)
        const html = TEXT[lang].HTML.replaceAll("#name#", user.name)
        sendMail(user.email, subject, html)
        return success(response)
      }
      return fail(`Invalid code.`, response)
    },
    {
      body: t.Object({
        target: t.Number(),
        code: t.String(),
        user: t.Object({
          email: t.String(),
          name: t.String(),
          password: t.String(),
        }),
        lang: t.Numeric(),
      }),
    },
  )
