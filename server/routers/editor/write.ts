import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import sanitizeHtml from "sanitize-html"
import { checkUserVerification } from "../../database/auth/authorization"
import { havePermission, updateUserPoint } from "../../database/board/common"
import { BOARD_TYPE } from "../../database/board/const"
import {
  getWriteConfig,
  saveAttachments,
  saveTags,
  writeNewPost
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

export const writeRouter = new Elysia()
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
      body: t.Object(WRITE_TYPE_CHECK),
    },
  )
