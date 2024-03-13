/**
 * server/routers/user/chat
 *
 * 채팅 관련 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, DEFAULT_TYPE_CHECK } from "../../util/tools"
import { ChatHistory } from "../../../src/interface/user"
import { getChatHistory, isBannedByOther, saveNewChat } from "../../database/user/chat"
import { havePermission } from "../../database/board/common"

export const chat = new Elysia()
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
    "/load/chathistory",
    async ({ query: { userUid, limit }, accessUserUid }) => {
      let response: ChatHistory[] = []
      if (userUid < 1 || accessUserUid < 1) {
        return fail(`Invalid parameters.`, response)
      }

      response = await getChatHistory(accessUserUid, userUid, limit)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        userUid: t.Numeric(),
        limit: t.Numeric(),
      }),
    },
  )
  .post(
    "/savechat",
    async ({ body: { userUid, message }, accessUserUid }) => {
      let response = 0
      if (userUid < 1 || message.length < 1) {
        return fail(`Invalid parameters.`, response)
      }
      if ((await isBannedByOther(accessUserUid, userUid)) === true) {
        return fail(`You have been blocked.`, response)
      }
      if ((await havePermission(accessUserUid, "send_chat")) === false) {
        return fail(`You have no permission.`, response)
      }

      message = Bun.escapeHTML(message)
      response = await saveNewChat(accessUserUid, userUid, message)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        userUid: t.Numeric(),
        message: t.String(),
      }),
    },
  )
