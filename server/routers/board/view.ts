import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import {
  Pair,
  PhotoItem,
  PostFile,
  WriterLatestComment,
  WriterLatestPost
} from "../../../src/interface/board"
import { checkUserVerification } from "../../database/auth/authorization"
import { updateUserPoint } from "../../database/board/common"
import { BOARD_CONFIG, CONTENT_STATUS, INIT_POST_VIEW } from "../../database/board/const"
import { getPhotoItems } from "../../database/board/gallery"
import { getBoardConfig, getUserLevel } from "../../database/board/list"
import {
  getFiles,
  getPost,
  getPrevNextPostUid,
  getTags,
  getWriterLatestPostComment,
  isBannedByWriter,
  updatePostHit
} from "../../database/board/view"
import { haveAdminPermission } from "../../database/user/manageuser"
import { fail, success } from "../../util/tools"

export const viewRouter = new Elysia()
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
    async ({
      query: { id, postUid, needUpdateHit, latestLimit },
      accessUserUid,
      userLevel,
      newAccessToken,
    }) => {
      let response = {
        config: BOARD_CONFIG,
        post: INIT_POST_VIEW,
        images: [] as PhotoItem[],
        files: [] as PostFile[],
        tags: [] as Pair[],
        prevPostUid: 0,
        nextPostUid: 0,
        newAccessToken,
        writerPosts: [] as WriterLatestPost[],
        writerComments: [] as WriterLatestComment[],
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

      const writer = await getWriterLatestPostComment(response.post.writer.uid, latestLimit)
      response.writerPosts = writer.posts
      response.writerComments = writer.comments

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
        latestLimit: t.Numeric(),
      }),
    },
  )