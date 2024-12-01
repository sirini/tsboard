import { Elysia, t } from "elysia"
import {
  changePassword
} from "../../database/auth/resetpassword"
import { fail, success } from "../../util/tools"

export const updatePasswordRouter = new Elysia()
  .post(
    "/change/password",
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
