/**
 * server/routers/user/chat
 *
 * 채팅 관련 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, DEFAULT_TYPE_CHECK, EXTEND_TYPE_CHECK } from "../../util/tools"
import { ChatHistory, ChatItem } from "../../../src/interface/user"
import { getChatHistory, getChatList, isBannedByOther, saveNewChat } from "../../database/user/chat"
import { havePermission } from "../../database/board/common"
import { checkUserVerification } from "../../database/auth/authorization"

export const chat = new Elysia()
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
      refreshToken: refresh.value,
    })

    if (verification.success === true) {
      accessUserUid = verification.accessUserUid
    }

    return {
      accessUserUid,
    }
  })
  .get(
    "/load/chat/list",
    async ({ query: { limit }, accessUserUid }) => {
      let response: ChatItem[] = []
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      const list = await getChatList(accessUserUid, limit)
      return success(list)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        limit: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
  .get(
    "/load/chat/history",
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
    "/save/chat",
    async ({ body: { targetUserUid, message }, accessUserUid }) => {
      let response = 0

      if (accessUserUid < 1 || targetUserUid < 1 || message.length < 1) {
        return fail(`Invalid parameters.`, response)
      }
      if ((await isBannedByOther(accessUserUid, targetUserUid)) === true) {
        return fail(`You have been blocked.`, response)
      }
      if ((await havePermission(accessUserUid, "send_chat")) === false) {
        return fail(`You have no permission.`, response)
      }

      message = Bun.escapeHTML(message)
      response = await saveNewChat(accessUserUid, targetUserUid, message)
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        message: t.String(),
        targetUserUid: t.Numeric(),
      }),
    },
  )
