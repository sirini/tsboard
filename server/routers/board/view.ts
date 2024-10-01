/**
 * server/routers/board/view
 *
 * 게시글 보기 관련 라우팅 처리
 */

import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { BoardListItem, Pair, PhotoItem, PostFile } from "../../../src/interface/board"
import { checkUserVerification } from "../../database/auth/authorization"
import { updateUserPoint } from "../../database/board/common"
import { BOARD_CONFIG, CONTENT_STATUS, INIT_POST_VIEW } from "../../database/board/const"
import { isAuthor } from "../../database/board/editor"
import { getPhotoItems } from "../../database/board/gallery"
import { getBoardConfig, getUserLevel } from "../../database/board/list"
import {
  applyMovePost,
  getBoardListItems,
  getDownloadPath,
  getDownloadPermission,
  getFiles,
  getPost,
  getPrevNextPostUid,
  getTags,
  isBannedByWriter,
  likePost,
  removePost,
  updatePostHit,
} from "../../database/board/view"
import { haveAdminPermission } from "../../database/user/manageuser"
import { DEFAULT_TYPE_CHECK, EXTEND_TYPE_CHECK, fail, success } from "../../util/tools"

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
    "/view",
    async ({ query: { id, postUid, needUpdateHit }, accessUserUid, userLevel, newAccessToken }) => {
      let response = {
        config: BOARD_CONFIG,
        post: INIT_POST_VIEW,
        images: [] as PhotoItem[],
        files: [] as PostFile[],
        tags: [] as Pair[],
        prevPostUid: 0,
        nextPostUid: 0,
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

      const photos = await getPhotoItems(postUid)
      response.images = photos

      response.post = await getPost(postUid, accessUserUid)
      if (response.post.submitted < 1) {
        return fail(`Post not found.`, response)
      }

      if (response.post.status === CONTENT_STATUS.SECRET) {
        const isAdmin = await haveAdminPermission(accessUserUid, response.config.uid)
        if (accessUserUid !== response.post.writer.uid && isAdmin === false) {
          response.post = INIT_POST_VIEW
          response.files = []
          response.tags = []
          response.images = []
          return fail(`You don't have permission to read this post.`, response)
        }
      }

      if (needUpdateHit > 0) {
        updatePostHit(postUid)
      }

      response.tags = await getTags(postUid)
      const neighbor = await getPrevNextPostUid(response.config.uid, postUid)
      response.prevPostUid = neighbor.prevPostUid
      response.nextPostUid = neighbor.nextPostUid
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
