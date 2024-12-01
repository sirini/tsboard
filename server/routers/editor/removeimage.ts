import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import {
  removeUploadedImage
} from "../../database/board/editor"
import { getUserLevel } from "../../database/board/list"
import {
  DEFAULT_TYPE_CHECK,
  fail,
  success
} from "../../util/tools"

export const removeImageRouter = new Elysia()
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