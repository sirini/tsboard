/**
 * server/routers/board/gallery
 *
 * 갤러리 목록보기와 관련된 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, getUpdatedAccessToken, success } from "../../util/tools"
import { BOARD_CONFIG } from "../../database/board/const"
import { GridItem } from "../../../src/interface/gallery"
import {
  getBoardConfig,
  getMaxPostUid,
  getTotalPostCount,
  getUserLevel,
} from "../../database/board/list"
import { getPhotos } from "../../database/board/gallery"
import { SearchOption } from "../../../src/interface/board"

export const gallery = new Elysia()
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
    "/photolist",
    async ({
      query: { id, sinceUid, option, keyword, page, pagingDirection },
      accessUserUid,
      userLevel,
      newAccessToken,
    }) => {
      let response = {
        totalPostCount: 0,
        config: BOARD_CONFIG,
        images: [] as GridItem[],
        newAccessToken,
      }

      if (id.length < 2) {
        return fail(`Invalid gallery ID.`, response)
      }
      const config = await getBoardConfig(id)
      if (config.uid < 1) {
        return fail(`Gallery not found.`, response)
      }
      response.config = config
      if (config.level.list > userLevel) {
        return fail(`Level restriction.`, response)
      }

      if (sinceUid < 1) {
        sinceUid = (await getMaxPostUid(config.uid)) + 1
      }

      const totalPostCount = await getTotalPostCount(config.uid)
      const searchOption = option as SearchOption
      const images = await getPhotos({
        boardUid: config.uid,
        page,
        bunch: config.row,
        sinceUid,
        accessUserUid,
        pagingDirection,
        option: searchOption,
        keyword,
      })

      return success({
        totalPostCount,
        config,
        images,
        newAccessToken,
      })
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        id: t.String(),
        page: t.Numeric(),
        pagingDirection: t.Numeric(),
        sinceUid: t.Numeric(),
        option: t.Numeric(),
        keyword: t.String(),
      }),
    },
  )
