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
import { fail, getUpdatedAccessToken, refineText, success } from "../../util/tools"
import {
  getCategories,
  getMaxImageUid,
  getSuggestionTags,
  getTotalImageCount,
  loadUploadedImages,
  removeUploadedImage,
  saveAttachments,
  saveTags,
  uploadImages,
  writeNewPost,
} from "../../database/board/editor"
import { BOARD_CONFIG } from "../../database/board/const"
import { CountPair, Pair } from "../../../src/interface/board"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

const htmlFilter = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  allowedAttributes: {
    code: ["class"],
    img: ["src", "alt", "class"],
    span: ["class"],
  },
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
    async ({ body: { boardUid, sizeLimit, images }, newAccessToken, accessUserUid }) => {
      const response = {
        newAccessToken: "",
        uploadedImages: [],
      }
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      if (images === undefined) {
        return fail(`Invalid image files.`, response)
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
      ...defaultTypeCheck,
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
    async ({ query: { boardUid, lastUid, bunch }, accessUserUid, newAccessToken }) => {
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
      ...defaultTypeCheck,
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
      ...defaultTypeCheck,
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
      ...defaultTypeCheck,
      query: t.Object({
        tag: t.String(),
        limit: t.Numeric(),
      }),
    },
  )
  .post(
    "/write",
    async ({
      body: { boardUid, categoryUid, title, content, attachments, tags },
      accessUserUid,
      newAccessToken,
    }) => {
      const response = {
        newAccessToken: "",
        postUid: 0,
      }
      if (accessUserUid < 1) {
        return fail(`Please log in.`, response)
      }
      if (categoryUid < 1 || title.trim().length < 2 || content.trim().length < 3) {
        return fail(`Invalid parameters.`, response)
      }

      title = Bun.escapeHTML(title)
      content = sanitizeHtml(content, htmlFilter)

      const postUid = await writeNewPost({
        boardUid,
        accessUserUid,
        categoryUid,
        title,
        content,
      })

      if (tags.length > 0) {
        tags = tags.map((tag) => refineText(tag))
        await saveTags(boardUid, postUid, tags)
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
      ...defaultTypeCheck,
      body: t.Object({
        boardUid: t.Numeric(),
        categoryUid: t.Numeric(),
        title: t.String(),
        content: t.String(),
        attachments: t.Optional(
          t.Files({
            type: ["application/pdf", "application/zip", "audio", "font", "image", "video"],
            maxSize: parseInt(process.env.MAX_FILE_SIZE ?? "102476800"),
          }),
        ),
        tags: t.Array(t.String()),
      }),
    },
  )
