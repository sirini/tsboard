/**
 * server/routers/board/editor
 *
 * 글작성용 에디터에 필요한 라우팅 처리
 */

import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import sanitizeHtml from "sanitize-html"
import { CountPair, Pair, PostFile } from "../../../src/interface/board"
import { SIZE } from "../../../tsboard.config"
import { checkUserVerification } from "../../database/auth/authorization"
import { checkPermission, havePermission, updateUserPoint } from "../../database/board/common"
import { BOARD_CONFIG, BOARD_TYPE, INIT_POST_VIEW } from "../../database/board/const"
import {
  getCategories,
  getMaxImageUid,
  getSuggestionTags,
  getTotalImageCount,
  getWriteConfig,
  loadUploadedImages,
  modifyOriginalPost,
  removeAttachedFile,
  removeOriginalTags,
  removeUploadedImage,
  saveAttachments,
  saveTags,
  uploadImages,
  writeNewPost,
} from "../../database/board/editor"
import { getBoardConfig, getUserLevel } from "../../database/board/list"
import { getFiles, getPost, getTags } from "../../database/board/view"
import { haveAdminPermission } from "../../database/user/manageuser"
import {
  DEFAULT_HTML_FILTER,
  DEFAULT_TYPE_CHECK,
  EXTEND_TYPE_CHECK,
  fail,
  refineText,
  success,
} from "../../util/tools"

const writeBody = {
  boardUid: t.Numeric(),
  isNotice: t.Numeric(),
  isSecret: t.Numeric(),
  categoryUid: t.Numeric(),
  title: t.String(),
  content: t.String(),
  tags: t.String(),
  attachments: t.Optional(
    t.Files({
      type: ["application/pdf", "application/zip", "audio", "font", "image", "video"],
      maxSize: SIZE.MAX_FILE,
      error: "Invalid file type or exceed file size.",
    }),
  ),
}

export const editorRouter = new Elysia()
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
    "/config",
    async ({ query: { id, userUid }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
        config: BOARD_CONFIG,
        categories: [] as Pair[],
        isAdmin: false,
      }
      if (id.length < 2) {
        return fail(`Invalid board ID.`, response)
      }
      const config = await getBoardConfig(id)
      const categories = await getCategories(config.uid)
      const isAdmin = await haveAdminPermission(userUid, config.uid)
      return success({
        newAccessToken,
        config,
        categories,
        isAdmin,
      })
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        id: t.String(),
        userUid: t.Numeric(),
      }),
    },
  )
  .post(
    "/upload/images",
    async ({ body: { boardUid, images }, newAccessToken, accessUserUid, userLevel }) => {
      const response = {
        newAccessToken,
        uploadedImages: [],
      }

      if (boardUid < 1 || accessUserUid < 1) {
        return fail(`Invalid parameters.`, response)
      }
      if (images === undefined) {
        return fail(`Invalid image files.`, response)
      }
      const writeConfig = await getWriteConfig(boardUid)
      const writeLevel = writeConfig.level
      if (writeLevel > userLevel) {
        return fail(`Level restriction.`, response)
      }
      if ((await havePermission(accessUserUid, "write_post")) === false) {
        return fail(`You have no permission.`, response)
      }

      const uploadedImages = await uploadImages({
        boardUid,
        accessUserUid,
        images,
      })

      return success({
        newAccessToken,
        uploadedImages,
      })
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        images: t.Optional(
          t.Files({
            type: "image",
            error: "Invalid images.",
          }),
        ),
      }),
    },
  )
  .get(
    "/load/images",
    async ({ query: { boardUid, lastUid, bunch }, accessUserUid, newAccessToken, userLevel }) => {
      const response = {
        images: [],
        newAccessToken,
        maxImageUid: 0,
        totalImageCount: 0,
      }
      if (boardUid < 1 || lastUid < 0 || bunch < 1 || bunch > 100) {
        return fail(`Invalid parameters.`, response)
      }
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      const writeConfig = await getWriteConfig(boardUid)
      const writeLevel = writeConfig.level
      if (writeLevel > userLevel) {
        return fail(`Level restriction.`, response)
      }

      const maxImageUid = await getMaxImageUid(boardUid, accessUserUid)
      const totalImageCount = await getTotalImageCount(boardUid, accessUserUid)
      const images = await loadUploadedImages({
        boardUid,
        lastUid,
        accessUserUid,
        maxUid: maxImageUid,
        bunch,
      })

      return success({
        images,
        newAccessToken,
        maxImageUid,
        totalImageCount,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        boardUid: t.Numeric(),
        lastUid: t.Numeric(),
        bunch: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
  .delete(
    "/remove/image",
    async ({ query: { imageUid }, accessUserUid, newAccessToken }) => {
      const response = {
        newAccessToken,
      }
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      if (imageUid < 1) {
        return fail(`Invalid image uid.`, response)
      }

      const removeImageResult = await removeUploadedImage(imageUid, accessUserUid)
      if (removeImageResult === false) {
        return fail(`Unable to remove image (${imageUid})`, response)
      }
      return success({
        newAccessToken,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        imageUid: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
  .get(
    "/tag/suggestion",
    async ({ query: { tag, limit }, accessUserUid }) => {
      const response = {
        suggestions: [] as CountPair[],
      }
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      if (tag.length < 3) {
        return fail(`Tag is too short.`, response)
      }
      const suggestions = await getSuggestionTags(tag, limit)
      return success({
        suggestions,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        tag: t.String(),
        limit: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
  .post(
    "/write",
    async ({
      body: { boardUid, categoryUid, title, content, attachments, tags, isNotice, isSecret },
      accessUserUid,
      newAccessToken,
      userLevel,
    }) => {
      const response = {
        newAccessToken: "",
        postUid: 0,
      }
      if (categoryUid < 1 || title.trim().length < 2 || content.trim().length < 3) {
        return fail(`Invalid parameters.`, response)
      }

      const writeConfig = await getWriteConfig(boardUid)
      const writeLevel = writeConfig.level
      if (writeLevel > userLevel) {
        return fail(`Level restriction.`, response)
      }
      if ((await havePermission(accessUserUid, "write_post")) === false) {
        return fail(`You have no permission.`, response)
      }

      if (writeConfig.type === BOARD_TYPE.BLOG && writeConfig.adminUid !== accessUserUid) {
        return fail(`Only blog owner can write a new post.`, response)
      }

      const updatePointResult = await updateUserPoint({
        boardUid,
        accessUserUid,
        action: "write",
      })
      const writePoint = writeConfig.point
      if (updatePointResult === false && writePoint < 0) {
        return fail(`Not enough point.`, response)
      }

      title = Bun.escapeHTML(title)
      content = sanitizeHtml(content, DEFAULT_HTML_FILTER)

      let isNoticePost = false
      if ((await haveAdminPermission(accessUserUid, boardUid)) === true && isNotice > 0) {
        isNoticePost = true
      }

      const postUid = await writeNewPost({
        boardUid,
        accessUserUid,
        categoryUid,
        title,
        content,
        isNoticePost,
        isSecretPost: isSecret > 0 ? true : false,
      })

      if (tags.length > 0) {
        const inputTags = tags.split(",")
        const refinedTags = inputTags.map((tag) => refineText(tag))
        await saveTags(boardUid, postUid, refinedTags)
      }

      if (attachments) {
        await saveAttachments(boardUid, postUid, attachments)
      }

      return success({
        newAccessToken,
        postUid,
      })
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object(writeBody),
    },
  )
  .get(
    "/load/post",
    async ({ query: { boardUid, postUid }, accessUserUid, newAccessToken }) => {
      let response = {
        post: INIT_POST_VIEW,
        files: [] as PostFile[],
        tags: [] as Pair[],
        newAccessToken,
      }
      if (postUid < 1) {
        return fail(`Invalid parameters.`, response)
      }
      const checked = await checkPermission({
        accessUserUid,
        boardUid,
        postUid,
        action: "write_post",
        target: "post",
      })
      if (checked.result === false) {
        return fail(checked.error, response)
      }

      response.post = await getPost(postUid, accessUserUid)
      response.files = await getFiles(postUid)
      response.tags = await getTags(postUid)
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
  .delete(
    "/remove/attached",
    async ({ query: { boardUid, postUid, fileUid }, accessUserUid }) => {
      let response = ""
      if (fileUid < 1) {
        return fail(`Invalid parameter.`, response)
      }
      const checked = await checkPermission({
        accessUserUid,
        boardUid,
        postUid,
        action: "write_post",
        target: "post",
      })
      if (checked.result === false) {
        return fail(checked.error, response)
      }
      removeAttachedFile(fileUid)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        boardUid: t.Numeric(),
        postUid: t.Numeric(),
        fileUid: t.Numeric(),
        userUid: t.Numeric(),
      }),
    },
  )
  .patch(
    "/modify",
    async ({
      body: {
        boardUid,
        categoryUid,
        postUid,
        title,
        content,
        attachments,
        tags,
        isNotice,
        isSecret,
      },
      accessUserUid,
      newAccessToken,
    }) => {
      const response = {
        newAccessToken,
      }
      if (
        boardUid < 1 ||
        categoryUid < 1 ||
        postUid < 1 ||
        title.trim().length < 2 ||
        content.trim().length < 3
      ) {
        return fail(`Invalid parameters.`, response)
      }
      const checked = await checkPermission({
        accessUserUid,
        boardUid,
        postUid,
        action: "write_post",
        target: "post",
      })
      if (checked.result === false) {
        return fail(checked.error, response)
      }

      await removeOriginalTags(postUid)

      title = Bun.escapeHTML(title)
      content = sanitizeHtml(content, DEFAULT_HTML_FILTER)

      let isNoticePost = false
      if ((await haveAdminPermission(accessUserUid, boardUid)) === true) {
        if (isNotice > 0) {
          isNoticePost = true
        }
      }

      await modifyOriginalPost({
        boardUid,
        accessUserUid,
        categoryUid,
        title,
        content,
        postUid,
        isNoticePost,
        isSecretPost: isSecret > 0 ? true : false,
      })

      if (tags.length > 0) {
        const inputTags = tags.split(",")
        const refinedTags = inputTags.map((tag) => refineText(tag))
        saveTags(boardUid, postUid, refinedTags)
      }

      if (attachments) {
        saveAttachments(boardUid, postUid, attachments)
      }

      return success({
        newAccessToken,
      })
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        ...writeBody,
        postUid: t.Numeric(),
      }),
    },
  )
