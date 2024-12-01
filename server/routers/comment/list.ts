import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { Comment } from "../../../src/interface/board"
import { checkUserVerification } from "../../database/auth/authorization"
import {
  getBoardUid,
  getComments,
  getMaxCommentUid,
  getPostInfo,
  getTotalCommentCount,
  getViewPostLevel
} from "../../database/board/comment"
import { CONTENT_STATUS } from "../../database/board/const"
import { getUserLevel } from "../../database/board/list"
import { haveAdminPermission } from "../../database/user/manageuser"
import {
  fail,
  success
} from "../../util/tools"

export const listRouter = new Elysia()
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
    "/list",
    async ({
      query: { postUid, id, page, bunch, pagingDirection, sinceUid },
      accessUserUid,
      userLevel,
    }) => {
      const response = {
        boardUid: 0,
        sinceUid: 0,
        comments: [] as Comment[],
        totalCommentCount: 0,
      }

      if (id.length < 2 || postUid < 1 || page < 1 || bunch < 1 || sinceUid < 0) {
        return fail(`Invalid parameters.`, response)
      }

      response.boardUid = await getBoardUid(id)
      const configViewLevel = await getViewPostLevel(response.boardUid)
      if (configViewLevel > userLevel) {
        return fail(`Level restriction.`, response)
      }

      const post = await getPostInfo(postUid)
      const isAdmin = await haveAdminPermission(accessUserUid, response.boardUid)
      if (post.status === CONTENT_STATUS.SECRET) {
        if (accessUserUid !== post.writerUid && isAdmin === false) {
          return fail(`You don't have permission to read comments.`, response)
        }
      }

      if (post.status === CONTENT_STATUS.REMOVED) {
        return fail(`Post has been removed.`, response)
      }

      if (sinceUid < 1) {
        sinceUid = (await getMaxCommentUid(postUid)) + 1
      }
      response.totalCommentCount = await getTotalCommentCount(postUid)
      response.comments = await getComments({
        postUid,
        page,
        bunch,
        sinceUid,
        accessUserUid,
        pagingDirection,
      })
      return success(response)
    },
    {
      query: t.Object({
        id: t.String(),
        postUid: t.Numeric(),
        page: t.Numeric(),
        pagingDirection: t.Numeric(),
        sinceUid: t.Numeric(),
        bunch: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )