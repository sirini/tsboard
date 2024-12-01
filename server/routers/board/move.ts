import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import {
  BoardListItem
} from "../../../src/interface/board"
import { checkUserVerification } from "../../database/auth/authorization"
import { getUserLevel } from "../../database/board/list"
import {
  applyMovePost,
  getBoardListItems
} from "../../database/board/view"
import { haveAdminPermission } from "../../database/user/manageuser"
import { DEFAULT_TYPE_CHECK, fail, success } from "../../util/tools"

export const moveRouter = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0
    let userLevel = 0
    let newAccessToken = ""

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value ?? "",
    })

    if (verification.success === true) {
      accessUserUid = verification.accessUserUid
      userLevel = await getUserLevel(accessUserUid)
      newAccessToken = verification.newAccessToken
    }

    return {
      accessUserUid,
      userLevel,
      newAccessToken,
    }
  })
  .get(
    "/move/list",
    async ({ query: { boardUid }, accessUserUid, newAccessToken }) => {
      let response = {
        boards: [] as BoardListItem[],
        newAccessToken,
      }

      const isAdmin = await haveAdminPermission(accessUserUid, boardUid)
      if (isAdmin === false) {
        return fail(`Unauthorized access.`, response)
      }

      response.boards = await getBoardListItems()
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        boardUid: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
  .put(
    "/move/apply",
    async ({ query: { boardUid, targetBoardUid, postUid }, accessUserUid, newAccessToken }) => {
      let response = {
        newAccessToken,
      }

      const isAdmin = await haveAdminPermission(accessUserUid, boardUid)
      if (isAdmin === false) {
        return fail(`Unauthorized access.`, response)
      }

      const result = await applyMovePost(postUid, targetBoardUid)
      if (result === false) {
        return fail(`Invalid target board.`, response)
      }

      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        boardUid: t.Numeric(),
        targetBoardUid: t.Numeric(),
        userUid: t.Numeric(),
        postUid: t.Numeric(),
      }),
    },
  )
