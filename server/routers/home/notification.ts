/**
 * server/routers/home/notification
 *
 * 알림 내역 가져오기, 읽음 표시하기 등 라우팅
 */

import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { TsboardNotification } from "../../../src/interface/home"
import { checkUserVerification } from "../../database/auth/authorization"
import { checkedAllNotifications, getNotifications } from "../../database/home/notification"
import { DEFAULT_TYPE_CHECK, EXTEND_TYPE_CHECK, fail, success } from "../../util/tools"

export const notificationRouter = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value ?? "",
    })

    if (verification.success === true) {
      accessUserUid = verification.accessUserUid
    }

    return {
      accessUserUid,
    }
  })
  .get(
    "/load/notification",
    async ({ accessUserUid, query: { limit } }) => {
      let response = [] as TsboardNotification[]
      if (accessUserUid < 1 || limit < 1) {
        return fail(`Invalid parameters.`, response)
      }

      response = await getNotifications(accessUserUid, limit)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        limit: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
  .patch(
    "/checked/notification",
    async ({ accessUserUid }) => {
      const response = ""
      if (accessUserUid < 1) {
        return fail(`Invalid parameter.`, response)
      }

      checkedAllNotifications(accessUserUid)
      return success(response)
    },
    EXTEND_TYPE_CHECK,
  )
