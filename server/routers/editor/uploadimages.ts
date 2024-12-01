import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import { havePermission } from "../../database/board/common"
import {
  getWriteConfig,
  uploadImages
} from "../../database/board/editor"
import { getUserLevel } from "../../database/board/list"
import {
  EXTEND_TYPE_CHECK,
  fail,
  success
} from "../../util/tools"

export const uploadImagesRouter = new Elysia()
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