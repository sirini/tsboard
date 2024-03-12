/**
 * server/routers/home/notification
 *
 * 알림 내역 가져오기, 읽음 표시하기 등 라우팅
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, DEFAULT_TYPE_CHECK } from "../../util/tools"
import { Notification } from "../../../src/interface/home"
import { getNotifications } from "../../database/home/notification"

export const notification = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers, cookie }) => {
    let accessUserUid = 0
    const access = await jwt.verify(headers.authorization ?? "")
    if (access === false) {
      return {
        accessUserUid,
      }
    }
    accessUserUid = access.uid as number
    return {
      accessUserUid,
    }
  })
  .get(
    "/load/notification",
    async ({ accessUserUid, query: { limit } }) => {
      let response: Notification[] = []
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
      }),
    },
  )
