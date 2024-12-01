/**
 * server/routers/auth/resetpassword
 *
 * 비밀번호 초기화 처리
 */

import { Elysia, t } from "elysia"
import { LangType } from "../../../src/interface/home"
import {
  askResetPassword,
  isValidEmail,
  sendResetPassword
} from "../../database/auth/resetpassword"
import { fail, success } from "../../util/tools"

export const resetPassword = new Elysia()
  .post(
    "/reset/password",
    async ({ body: { email, lang } }) => {
      const response = {
        sendmail: false,
      }

      if ((await isValidEmail(email)) === false) {
        return fail(`Invalid email address.`, response)
      }

      if (process.env.GMAIL_APP_PASSWORD === undefined || process.env.GMAIL_APP_PASSWORD === "") {
        await askResetPassword(email, lang as LangType)
        return success(response)
      }
      await sendResetPassword(email, lang as LangType)
      return success({
        sendmail: true,
      })
    },
    {
      body: t.Object({
        email: t.String(),
        lang: t.Numeric(),
      }),
    },
  )