/**
 * server/routers/auth/signup
 *
 * 신규 회원 가입하기 처리
 */

import { Elysia, t } from "elysia"
import {
  isDuplicatedEmail,
  isDuplicatedName,
  addNewUser,
  sendVerificationMail,
  verify,
} from "../../database/auth/signup"
import { sendMail } from "../../util/sendmail"
import { fail, success } from "../../util/tools"
import { WELCOME } from "../../../src/messages/mail/welcome"

export const signUp = new Elysia()
  .post(
    "/signup",
    async ({ body: { email, password, name } }) => {
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
      const target = await sendVerificationMail(email, name)
      return success({ sendmail: true, target })
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        name: t.String(),
      }),
    },
  )
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
  .post(
    "/verify",
    async ({ body: { target, code, user } }) => {
      const response = ""
      const result = await verify(target, code, user)
      if (result) {
        const subject = WELCOME.SUBJECT.replaceAll("#name#", user.name)
        const html = WELCOME.HTML.replaceAll("#name#", user.name)
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
      }),
    },
  )
