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
import { fail, getUpdatedAccessToken, success } from "../../util/tools"
import { uploadImages } from "../../database/board/editor"
import { BOARD_CONFIG } from "../../database/board/const"

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
      }
      if (id.length < 2) {
        return fail(`Invalid board ID.`, response)
      }
      const config = await getBoardConfig(id)
      return success({
        newAccessToken,
        config,
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
      headers: t.Object({
        authorization: t.String(),
      }),
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
