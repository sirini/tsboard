/**
 * server/routers/board/editor
 *
 * 글작성용 에디터에 필요한 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import sanitizeHtml from "sanitize-html"
import { getUserLevel } from "../../database/board/list"
import { getBoardConfig } from "../../database/board/list"
import {
  fail,
  getUpdatedAccessToken,
  refineText,
  success,
  DEFAULT_TYPE_CHECK,
} from "../../util/tools"
import {
  getCategories,
  getMaxImageUid,
  getSuggestionTags,
  getTotalImageCount,
  getWriteLevel,
  getWritePoint,
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
import { BOARD_CONFIG, INIT_POST_VIEW } from "../../database/board/const"
import { CountPair, Pair, PostFile } from "../../../src/interface/board"
import { checkPermission, havePermission, updateUserPoint } from "../../database/board/common"
import { getFiles, getPost, getTags } from "../../database/board/view"
import { haveAdminPermission } from "../../database/user/manageuser"

const htmlFilter = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  allowedAttributes: {
    code: ["class"],
    img: ["src", "alt", "class"],
    span: ["class"],
  },
}

const writeBody = {
  boardUid: t.Numeric(),
  isNotice: t.Numeric(),
  categoryUid: t.Numeric(),
  title: t.String(),
  content: t.String(),
  tags: t.String(),
  attachments: t.Optional(
    t.Files({
      type: ["application/pdf", "application/zip", "audio", "font", "image", "video"],
      maxSize: parseInt(process.env.MAX_FILE_SIZE ?? "1024768000"),
      error: "Invalid file type.",
    }),
  ),
}

export const editor = new Elysia()
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
    "/config",
    async ({ query: { id }, newAccessToken }) => {
      const response = {
        newAccessToken: "",
        config: BOARD_CONFIG,
        categories: [] as Pair[],
      }
      if (id.length < 2) {
        return fail(`Invalid board ID.`, response)
      }
      const config = await getBoardConfig(id)
      const categories = await getCategories(config.uid)
      return success({
        newAccessToken,
        config,
        categories,
      })
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        id: t.String(),
      }),
    },
  )
  .post(
    "/uploadimages",
    async ({ body: { boardUid, sizeLimit, images }, newAccessToken, accessUserUid, userLevel }) => {
      const response = {
        newAccessToken,
        uploadedImages: [],
      }

      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      if (images === undefined) {
        return fail(`Invalid image files.`, response)
      }
      const writeLevel = await getWriteLevel(boardUid)
      if (writeLevel > userLevel) {
        return fail(`Level restriction.`, response)
      }
      if ((await havePermission(accessUserUid, "write_post")) === false) {
        return fail(`You have no permission.`, response)
      }

      const uploadedImages = await uploadImages({
        boardUid,
        sizeLimit,
        accessUserUid,
        images,
      })

      return success({
        newAccessToken,
        uploadedImages,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        boardUid: t.Numeric(),
        sizeLimit: t.Numeric(),
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
    "/loadimages",
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
      const writeLevel = await getWriteLevel(boardUid)
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
      }),
    },
  )
  .delete(
    "/removeimage",
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
      }),
    },
  )
  .get(
    "/tagsuggestion",
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
      }),
    },
  )
  .post(
    "/write",
    async ({
      body: { boardUid, categoryUid, title, content, attachments, tags, isNotice },
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
      const writeLevel = await getWriteLevel(boardUid)
      if (writeLevel > userLevel) {
        return fail(`Level restriction.`, response)
      }
      if ((await havePermission(accessUserUid, "write_post")) === false) {
        return fail(`You have no permission.`, response)
      }

      const updatePointResult = await updateUserPoint({
        boardUid,
        accessUserUid,
        action: "write",
      })
      const writePoint = await getWritePoint(boardUid)
      if (updatePointResult === false && writePoint < 0) {
        return fail(`Not enough point.`, response)
      }

      title = Bun.escapeHTML(title)
      content = sanitizeHtml(content, htmlFilter)

      let isNoticePost = false
      if ((await haveAdminPermission(accessUserUid)) === true) {
        if (isNotice > 0) {
          isNoticePost = true
        }
      }

      const postUid = await writeNewPost({
        boardUid,
        accessUserUid,
        categoryUid,
        title,
        content,
        isNoticePost,
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
        postUid,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object(writeBody),
    },
  )
  .get(
    "/loadpost",
    async ({ query: { postUid }, accessUserUid, newAccessToken }) => {
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
        postUid: t.Numeric(),
      }),
    },
  )
  .delete(
    "/removeattached",
    async ({ query: { postUid, fileUid }, accessUserUid }) => {
      let response = ""
      if (fileUid < 1) {
        return fail(`Invalid parameter.`, response)
      }
      const checked = await checkPermission({
        accessUserUid,
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
        postUid: t.Numeric(),
        fileUid: t.Numeric(),
      }),
    },
  )
  .patch(
    "/modify",
    async ({
      body: { boardUid, categoryUid, postUid, title, content, attachments, tags, isNotice },
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
        postUid,
        action: "write_post",
        target: "post",
      })
      if (checked.result === false) {
        return fail(checked.error, response)
      }

      await removeOriginalTags(postUid)

      title = Bun.escapeHTML(title)
      content = sanitizeHtml(content, htmlFilter)

      let isNoticePost = false
      if ((await haveAdminPermission(accessUserUid)) === true) {
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
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        ...writeBody,
        postUid: t.Numeric(),
      }),
    },
  )
