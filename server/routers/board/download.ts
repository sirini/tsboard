import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { checkUserVerification } from "../../database/auth/authorization"
import { updateUserPoint } from "../../database/board/common"
import { getUserLevel } from "../../database/board/list"
import {
  getDownloadPath,
  getDownloadPermission
} from "../../database/board/view"
import { fail, success } from "../../util/tools"

export const downloadRouter = new Elysia()
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