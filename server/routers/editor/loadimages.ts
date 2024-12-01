import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import {
  getMaxImageUid,
  getTotalImageCount,
  getWriteConfig,
  loadUploadedImages
} from "../../database/board/editor"
import { getUserLevel } from "../../database/board/list"
import {
  DEFAULT_TYPE_CHECK,
  fail,
  success
} from "../../util/tools"

export const loadImagesRouter = new Elysia()
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