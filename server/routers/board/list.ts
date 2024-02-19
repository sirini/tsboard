/**
 * server/routers/board/list
 *
 * 게시판 목록보기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getBoardConfig, getMaxPostUid, getPosts, getUserLevel } from "../../database/board/list"
import { fail, getUpdatedAccessToken, success } from "../../util/tools"
import { INIT_CONFIG } from "../../../src/store/board/const"

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
    async ({ query: { id, page }, accessUserUid, userLevel, newAccessToken }) => {
      let response = {
        maxUid: 0,
        config: INIT_CONFIG,
        posts: [],
        newAccessToken: "",
      }

      if (id.length < 2) {
        return fail(`Invalid board ID.`, response)
      }
      const config = await getBoardConfig(id)
      if (config.uid < 1) {
        return fail(`Board not found.`, response)
      }
      if (config.level.list > userLevel) {
        response.config = config
        return fail(`Level restriction.`, response)
      }

      const maxUid = await getMaxPostUid(config.uid)
      const posts = await getPosts({
        boardUid: config.uid,
        page,
        bunch: config.row,
        maxUid,
        accessUserUid,
      })
      return success({
        maxUid,
        config,
        posts,
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
      }),
    },
  )
