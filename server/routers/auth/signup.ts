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

export const signUp = new Elysia()
  .post(
    "/signup",
    async ({ body }) => {
      const { email, password, name } = body
      if ((await isDuplicatedEmail(email)) === true) {
        return {
          success: false,
          error: `Duplicated email address.`,
        }
      }
      if (password.length !== 64) {
        return {
          success: false,
          error: `Invalid password, it needs a sha256 hash code.`,
        }
      }
      if ((await isDuplicatedName(name)) === true) {
        return {
          success: false,
          error: `Duplicated name.`,
        }
      }

      // .env 에서 GMAIL 설정이 안되어 있을 경우 바로 추가
      if (process.env.GMAIL_OAUTH_USER === "") {
        const result = await addNewUser({ email, password, name })
        if (result === false) {
          return {
            success: false,
            error: `Unable to add a new user. (${email}, ${password}, ${name})`,
          }
        }
        return {
          success: true,
          sendmail: false,
        }
      }
      // GMAIL 설정이 되어 있다면 인증 메일을 발송한다
      const target = await sendVerificationMail(email, name)
      return {
        success: true,
        sendmail: true,
        target,
      }
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
    async ({ body }) => {
      if ((await isDuplicatedEmail(body.email.trim())) === true) {
        return {
          success: false,
          error: `Duplicated email address.`,
        }
      }
      return {
        success: true,
      }
    },
    {
      body: t.Object({
        email: t.String(),
      }),
    },
  )
  .post(
    "/checkname",
    async ({ body }) => {
      if ((await isDuplicatedName(body.name.trim())) === true) {
        return {
          success: false,
          error: `Duplicated name`,
        }
      }
      return {
        success: true,
      }
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    },
  )
  .post(
    "/verify",
    async ({ body }) => {
      const result = await verify(body.target, body.code, body.user)
      return {
        success: result,
      }
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
