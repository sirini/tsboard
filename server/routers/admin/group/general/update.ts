/**
 * server/routers/admin/group/general/update
 *
 * 특정 그룹에 대한 업데이트 작업 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, getUpdatedAccessToken, DEFAULT_TYPE_CHECK } from "../../../../util/tools"
import {
  changeGroupAdmin,
  removeBoard,
  createBoard,
} from "../../../../database/admin/group/general/update"
import { CREATE_BOARD_RESULT } from "../../../../database/admin/group/general/const"

export const update = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers, cookie }) => {
    let accessUserUid = 0
    let newAccessToken = ""

    if (headers.authorization !== undefined && cookie && cookie.refresh) {
      const access = await jwt.verify(headers.authorization)
      if (access !== false) {
        accessUserUid = access.uid as number
        newAccessToken = await getUpdatedAccessToken(
          jwt,
          headers.authorization,
          cookie.refresh.value,
        )
      }
    }
    return {
      accessUserUid,
      newAccessToken,
    }
  })
  .patch(
    "/changeadmin",
    async ({ body: { groupUid, userUid }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
      }

      if (groupUid < 1) {
        return fail(`Invalid group uid.`, response)
      }
      if (userUid < 1) {
        return fail(`Invalid user uid.`, response)
      }
      const result = await changeGroupAdmin(groupUid, userUid)
      if (result === false) {
        return fail(`User not found.`, response)
      }
      return success({
        newAccessToken,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        groupUid: t.Number(),
        userUid: t.Number(),
      }),
    },
  )
  .delete(
    "/removeboard",
    async ({ query: { boardUid }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
      }

      if (boardUid < 1) {
        return fail(`Invalid board uid.`, response)
      }

      const result = await removeBoard(boardUid)
      if (result === false) {
        return fail(`Board not found.`, response)
      }
      return success({
        newAccessToken,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        boardUid: t.Numeric(),
      }),
    },
  )
  .post(
    "/createboard",
    async ({ body: { groupUid, newId }, newAccessToken }) => {
      const response = CREATE_BOARD_RESULT

      if (groupUid < 1) {
        return fail(`Invalid group uid.`, response)
      }
      if (newId.length < 2) {
        return fail(`Board ID is too short.`, response)
      }
      const newBoardUid = await createBoard(newId, groupUid)
      if (newBoardUid < 1) {
        return fail(`Failed to create a new board, try another ID.`, response)
      }
      return success({
        newAccessToken,
        uid: newBoardUid,
        name: process.env.BOARD_NAME!,
        info: process.env.BOARD_INFO!,
        manager: {
          uid: process.env.BOARD_ADMIN!,
          name: "Admin",
        },
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        groupUid: t.Number(),
        newId: t.String(),
      }),
    },
  )
