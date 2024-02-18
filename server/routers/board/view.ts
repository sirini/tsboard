/**
 * server/routers/board/view
 *
 * 게시글 보기 관련 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getBoardConfig, getUserLevel } from "../../database/board/list"
import { getFiles, getPost, likePost } from "../../database/board/view"
import { fail, getUpdatedAccessToken, success } from "../../util/tools"
import { PostFile } from "../../../src/interface/board"

export const view = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers, cookie }) => {
    let accessUserUid = 0
    let userLevel = 0
    let newAccessToken = ""

    if (headers.authorization !== undefined && cookie && cookie.refresh) {
      const access = await jwt.verify(headers.authorization)
      if (access !== false) {
        accessUserUid = access.uid as number
        userLevel = await getUserLevel(accessUserUid)
        newAccessToken = await getUpdatedAccessToken(
          jwt,
          headers.authorization,
          cookie.refresh.value,
        )
      }
    }
    return {
      accessUserUid,
      userLevel,
      newAccessToken,
    }
  })
  .get(
    "/view",
    async ({ query: { id, postUid }, accessUserUid, userLevel, newAccessToken }) => {
      if (id.length < 2) {
        return fail(`Invalid board ID.`)
      }
      if (postUid < 1) {
        return fail(`Invalid post uid.`)
      }
      const config = await getBoardConfig(id)
      if (config.uid < 1) {
        return fail(`Board not found.`)
      }

      if (config.level.view > userLevel) {
        return fail(`Level restriction.`, JSON.stringify(config))
      }

      let files: PostFile[] = []
      if (config.level.download <= userLevel) {
        files = await getFiles(postUid)
      }

      const post = await getPost(postUid, accessUserUid)
      return success({
        config,
        post,
        files,
        newAccessToken: newAccessToken,
      })
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        id: t.String(),
        postUid: t.Numeric(),
      }),
    },
  )
  .patch(
    "/likepost",
    async ({ body: { boardUid, postUid, liked }, accessUserUid }) => {
      if (accessUserUid < 1) {
        return fail(`Please log in.`)
      }
      likePost({
        boardUid,
        postUid,
        accessUserUid,
        liked,
      })
      return success({})
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      body: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        liked: t.Numeric(),
      }),
    },
  )
