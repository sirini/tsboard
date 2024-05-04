/**
 * server/routers/admin/group/general/update
 *
 * 특정 그룹에 대한 업데이트 작업 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, DEFAULT_TYPE_CHECK, EXTEND_TYPE_CHECK } from "../../../../util/tools"
import {
  changeGroupAdmin,
  removeBoard,
  createBoard,
} from "../../../../database/admin/group/general/update"
import { CREATE_BOARD_RESULT } from "../../../../database/admin/group/general/const"
import { NEW_BOARD } from "../../../../../tsboard.config"
import { checkUserVerification } from "../../../../database/auth/authorization"
import { haveAdminPermission } from "../../../../database/user/manageuser"
import { NO_TABLE_TARGET } from "../../../../database/user/const"
import { BoardType } from "../../../../../src/interface/board"

export const update = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0
    let newAccessToken = ""

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value,
    })

    if (
      verification.success === true &&
      (await haveAdminPermission(verification.accessUserUid, NO_TABLE_TARGET)) === true
    ) {
      accessUserUid = verification.accessUserUid
      newAccessToken = verification.newAccessToken
    }

    return {
      accessUserUid,
      newAccessToken,
    }
  })
  .patch(
    "/change/admin",
    async ({ body: { groupUid, targetUserUid }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken: "",
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
      }
      if (groupUid < 1 || targetUserUid < 1) {
        return fail(`Invalid parameters.`, response)
      }
      const result = await changeGroupAdmin(groupUid, targetUserUid)
      if (result === false) {
        return fail(`User not found.`, response)
      }
      return success({
        newAccessToken,
      })
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        groupUid: t.Number(),
        targetUserUid: t.Number(),
      }),
    },
  )
  .delete(
    "/remove/board",
    async ({ query: { boardUid }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken: "",
      }

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
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
        userUid: t.Numeric(),
      }),
    },
  )
  .post(
    "/create/board",
    async ({ body: { groupUid, newId }, newAccessToken, accessUserUid }) => {
      const response = CREATE_BOARD_RESULT

      if (accessUserUid < 1) {
        return fail(`Unauthorized access.`, response)
      }
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
        type: NEW_BOARD.TYPE as BoardType,
        name: NEW_BOARD.NAME,
        info: NEW_BOARD.INFO,
        manager: {
          uid: NEW_BOARD.ADMIN,
          name: "Admin",
        },
      })
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        groupUid: t.Number(),
        newId: t.String(),
      }),
    },
  )
