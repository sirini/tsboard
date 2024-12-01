/**
 * server/routers/auth/signup
 *
 * 신규 회원 가입하기 처리
 */

import { Elysia, t } from "elysia"
import { LangType } from "../../../src/interface/home"
import {
  addNewUser,
  isDuplicatedEmail,
  isDuplicatedName,
  sendVerificationMail
} from "../../database/auth/signup"
import { fail, success } from "../../util/tools"

export const signUpRouter = new Elysia()
  .post(
    "/signup",
    async ({ body: { email, password, name, lang } }) => {
      const response = {
        sendmail: false,
        target: 0,
      }

      if ((await isDuplicatedEmail(email)) === true) {
        return fail(`Duplicated email address.`, response)
      }
      if (password.length !== 64) {
        return fail(`Invalid password, it needs a sha256 hash code.`, response)
      }
      if ((await isDuplicatedName(0, name)) === true) {
        return fail(`Duplicated name.`, response)
      }

      // .env 에서 GMAIL 설정이 안되어 있을 경우 바로 추가
      if (process.env.GMAIL_APP_PASSWORD === undefined || process.env.GMAIL_APP_PASSWORD === "") {
        const result = await addNewUser({ email, password, name })
        if (result === false) {
          return fail(`Unable to add a new user. (${email}, ${password}, ${name})`, response)
        }
        return success(response)
      }
      // GMAIL 설정이 되어 있다면 인증 메일을 발송한다
      const target = await sendVerificationMail(email, name, lang as LangType)
      return success({ sendmail: true, target })
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        name: t.String(),
        lang: t.Numeric(),
      }),
    },
  )