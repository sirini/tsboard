/**
 * server/routers/admin/group/general/update
 *
 * 특정 그룹에 대한 업데이트 작업 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, getUpdatedAccessToken } from "../../../../util/tools"
import {
  changeGroupAdmin,
  removeBoard,
  createBoard,
} from "../../../../database/admin/group/general/update"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

export const update = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .patch(
    "/changeadmin",
    async ({ jwt, cookie: { refresh }, headers, body: { groupUid, userUid } }) => {
      if (groupUid < 1) {
        return fail(`Invalid group uid.`)
      }
      if (userUid < 1) {
        return fail(`Invalid user uid.`)
      }

      const result = await changeGroupAdmin(groupUid, userUid)
      if (result === false) {
        return fail(`User not found.`)
      }

      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        groupUid: t.Number(),
        userUid: t.Number(),
      }),
    },
  )
  .delete(
    "/removeboard",
    async ({ jwt, cookie: { refresh }, headers, body: { boardUid } }) => {
      if (boardUid < 1) {
        return fail(`Invalid board uid.`)
      }

      const result = await removeBoard(boardUid)
      if (result === false) {
        return fail(`Board not found.`)
      }

      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Number(),
      }),
    },
  )
  .post(
    "/createboard",
    async ({ jwt, cookie: { refresh }, headers, body: { groupUid, newId } }) => {
      if (groupUid < 1) {
        return fail(`Invalid group uid.`)
      }
      if (newId.length < 2) {
        return fail(`Board ID is too short.`)
      }

      const newBoardUid = await createBoard(newId, groupUid)
      if (newBoardUid < 1) {
        return fail(`Failed to create a new board, try another ID.`)
      }

      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
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
      ...defaultTypeCheck,
      body: t.Object({
        groupUid: t.Number(),
        newId: t.String(),
      }),
    },
  )
