/**
 * server/routers/auth/resetpassword
 *
 * 비밀번호 초기화 처리
 */

import { Elysia, t } from "elysia"
import {
  isValidEmail,
  askResetPassword,
  sendResetPassword,
  changePassword,
} from "../../database/auth/resetpassword"
import { fail, success } from "../../util/tools"

export const resetPassword = new Elysia()
  .post(
    "/resetpassword",
    async ({ body: { email } }) => {
      const response = {
        sendmail: false,
      }

      if ((await isValidEmail(email)) === false) {
        return fail(`Invalid email address.`, response)
      }
      if (process.env.GMAIL_APP_PASSWORD === undefined || process.env.GMAIL_APP_PASSWORD === "") {
        await askResetPassword(email)
        return success(response)
      }
      await sendResetPassword(email)
      return success({
        sendmail: true,
      })
    },
    {
      body: t.Object({
        email: t.String(),
      }),
    },
  )
  .post(
    "/changepassword",
    async ({ body: { target, code, password } }) => {
      const response = ""
      if (target < 1 || code.length !== 6 || password.length !== 64) {
        return fail(`Invalid parameters.`, response)
      }
      const result = await changePassword({
        target,
        code,
        password,
      })
      if (result === false) {
        return fail(`Unable to change password.`, response)
      }
      return success(response)
    },
    {
      body: t.Object({
        target: t.Number(),
        code: t.String(),
        password: t.String(),
      }),
    },
  )
