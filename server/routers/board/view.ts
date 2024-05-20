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
  removePost,
  updatePostHit,
} from "../../database/board/view"
import { DEFAULT_TYPE_CHECK, EXTEND_TYPE_CHECK, fail, success } from "../../util/tools"
import { Pair, PostFile } from "../../../src/interface/board"
import { BOARD_CONFIG, INIT_POST_VIEW } from "../../database/board/const"
import { updateUserPoint } from "../../database/board/common"
import { haveAdminPermission } from "../../database/user/manageuser"
import { isAuthor } from "../../database/board/editor"
import { checkUserVerification } from "../../database/auth/authorization"
import { getPhotoItems } from "../../database/board/gallery"

export const view = new Elysia()
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
      refreshToken: refresh.value,
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
    "/view",
    async ({ query: { id, postUid, needUpdateHit }, accessUserUid, userLevel, newAccessToken }) => {
      let response = {
        config: BOARD_CONFIG,
        post: INIT_POST_VIEW,
        files: [] as PostFile[],
        tags: [] as Pair[],
        images: [] as string[],
        thumbs: [] as string[],
        descriptions: [] as string[],
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
      const photoItems = await getPhotoItems(postUid)
      response.images = photoItems.files
      response.thumbs = photoItems.thumbnails
      response.descriptions = photoItems.descriptions

      response.post = await getPost(postUid, accessUserUid)
      if (response.post.submitted < 1) {
        return fail(`Post not found.`, response)
      }

      if (needUpdateHit > 0) {
        updatePostHit(postUid)
      }

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
        needUpdateHit: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
  .patch(
    "/like/post",
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
      ...EXTEND_TYPE_CHECK,
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
        userUid: t.Numeric(),
      }),
    },
  )
  .delete(
    "/remove/post",
    async ({ query: { boardUid, postUid }, accessUserUid, newAccessToken }) => {
      let response = {
        newAccessToken,
      }
      if (postUid < 1) {
        return fail(`Invalid parameter.`, response)
      }
      const isAdmin = await haveAdminPermission(accessUserUid, boardUid)
      const isWriter = await isAuthor(postUid, accessUserUid, "post")
      if (isAdmin === false && isWriter === false) {
        return fail(`You are neither the author nor the administrator.`, response)
      }

      removePost(postUid)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
