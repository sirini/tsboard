/**
 * server/routers/auth/signup
 *
 * 신규 회원 가입하기 처리
 */

import { Elysia, t } from "elysia"
import { isDuplicatedEmail, isDuplicatedName, addNewUser } from "../../database/auth/signup"

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
      const result = await addNewUser({ email, password, name })
      if (result === false) {
        return {
          success: false,
          error: `Unable to add a new user. (${email}, ${password}, ${name})`,
        }
      }
      return {
        success: true,
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
