/**
 * server/routers/board/view
 *
 * 게시글 보기 관련 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getBoardConfig, getUserLevel } from "../../database/board/list"
import {
  getDownloadPath,
  getDownloadPermission,
  getFiles,
  getPost,
  getTags,
  isBannedByWriter,
  likePost,
} from "../../database/board/view"
import { fail, getUpdatedAccessToken, success } from "../../util/tools"
import { Pair, PostFile } from "../../../src/interface/board"
import { BOARD_CONFIG, INIT_POST } from "../../database/board/const"
import { updateUserPoint } from "../../database/board/common"

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
      let response = {
        config: BOARD_CONFIG,
        post: INIT_POST,
        files: [] as PostFile[],
        tags: [] as Pair[],
        newAccessToken,
      }
      if (id.length < 2 || postUid < 1) {
        return fail(`Invalid parameters.`, response)
      }
      response.config = await getBoardConfig(id)
      if (response.config.uid < 1) {
        return fail(`Board not found.`, response)
      }

      if (response.config.level.view > userLevel) {
        return fail(`Level restriction.`, response)
      }

      if ((await isBannedByWriter(postUid, accessUserUid)) === true) {
        return fail(`You have been blocked.`, response)
      }

      const updatePointResult = await updateUserPoint({
        boardUid: response.config.uid,
        accessUserUid,
        action: "view",
      })
      if (updatePointResult === false && response.config.point.view < 0) {
        return fail(`Not enough point.`, response)
      }

      if (response.config.level.download <= userLevel) {
        response.files = await getFiles(postUid)
      }

      response.post = await getPost(postUid, accessUserUid)
      response.tags = await getTags(postUid)
      return success(response)
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
      const response = ""
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      likePost({
        boardUid,
        postUid,
        accessUserUid,
        liked,
      })
      return success(response)
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
  .get(
    "/download",
    async ({ query: { boardUid, fileUid }, accessUserUid, userLevel }) => {
      const response = {
        name: "",
        path: "",
      }
      const permission = await getDownloadPermission(boardUid)
      if (permission.level > userLevel) {
        return fail(`Level restriction.`, response)
      }

      const download = await getDownloadPath(fileUid)
      const file = Bun.file(download.path)
      if ((await file.exists()) === false) {
        return fail(`File not found.`, response)
      }

      const updatePointResult = await updateUserPoint({
        boardUid,
        accessUserUid,
        action: "download",
      })
      if (updatePointResult === false && permission.point < 0) {
        return fail(`Not enough point.`, response)
      }

      return success({
        name: download.name,
        path: download.path,
      })
    },
    {
      query: t.Object({
        boardUid: t.Numeric(),
        fileUid: t.Numeric(),
      }),
    },
  )
