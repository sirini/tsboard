import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import sanitizeHtml from "sanitize-html"
import { checkUserVerification } from "../../database/auth/authorization"
import { checkPermission } from "../../database/board/common"
import {
  modifyOriginalPost,
  removeOriginalTags,
  saveAttachments,
  saveTags
} from "../../database/board/editor"
import { getUserLevel } from "../../database/board/list"
import { haveAdminPermission } from "../../database/user/manageuser"
import {
  DEFAULT_HTML_FILTER,
  EXTEND_TYPE_CHECK,
  fail,
  refineText,
  success,
  WRITE_TYPE_CHECK
} from "../../util/tools"

export const modifyRouter = new Elysia()
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
        ...WRITE_TYPE_CHECK,
        postUid: t.Numeric(),
      }),
    },
  )
