/**
 * server/routers/board/list
 *
 * 게시판 목록보기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import {
  getBoardConfig,
  getMaxPostUid,
  getPosts,
  getTotalPostCount,
  getUserLevel,
} from "../../database/board/list"
import { fail, getUpdatedAccessToken, success } from "../../util/tools"
import { BOARD_CONFIG, PAGING_DIRECTION } from "../../database/board/const"
import { Post } from "../../../src/interface/board"

export const list = new Elysia()
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
    "/list",
    async ({
      query: { id, page, pagingDirection, maxUid, minUid },
      accessUserUid,
      userLevel,
      newAccessToken,
    }) => {
      let response = {
        maxUid: 0,
        minUid: 0,
        totalPostCount: 0,
        config: BOARD_CONFIG,
        posts: [] as Post[],
        newAccessToken,
      }

      if (id.length < 2) {
        return fail(`Invalid board ID.`, response)
      }
      const config = await getBoardConfig(id)
      if (config.uid < 1) {
        return fail(`Board not found.`, response)
      }
      response.config = config
      if (config.level.list > userLevel) {
        return fail(`Level restriction.`, response)
      }

      if (maxUid < 1) {
        response.maxUid = await getMaxPostUid(config.uid)
      }
      response.totalPostCount = await getTotalPostCount(config.uid)
      response.posts = await getPosts({
        boardUid: config.uid,
        page,
        bunch: config.row,
        maxUid,
        minUid,
        accessUserUid,
        pagingDirection,
      })

      let maxUidIndex = 0
      let minUidIndex = -1
      if (pagingDirection === PAGING_DIRECTION.PREV) {
        maxUidIndex = -1
        minUidIndex = 0
      }
      response.maxUid = response.posts.at(maxUidIndex)?.uid ?? 0
      response.minUid = response.posts.at(minUidIndex)?.uid ?? 0
      return success(response)
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        id: t.String(),
        page: t.Numeric(),
        pagingDirection: t.Numeric(),
        maxUid: t.Numeric(),
        minUid: t.Numeric(),
      }),
    },
  )
