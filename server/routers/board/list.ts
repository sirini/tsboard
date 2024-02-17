/**
 * server/routers/board/list
 *
 * 게시판 목록보기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getBoardConfig, getMaxPostUid, getPosts, getUserLevel } from "../../database/board/list"
import { fail, getUpdatedAccessToken, success } from "../../util/tools"

export const list = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .state("accessUserUid", 0)
  .state("userLevel", 0)
  .onBeforeHandle(async ({ jwt, cookie: { refresh }, headers, store }) => {
    if (headers.authorization !== undefined && refresh.value.length > 0) {
      const access = await jwt.verify(headers.authorization)
      if (access !== false) {
        store.accessUserUid = access.uid as number
        store.userLevel = await getUserLevel(store.accessUserUid)
      }
    }
  })
  .get(
    "/list",
    async ({
      jwt,
      cookie: { refresh },
      headers,
      query: { id, page },
      store: { accessUserUid, userLevel },
    }) => {
      if (id.length < 2) {
        return fail(`Invalid board ID.`)
      }
      const config = await getBoardConfig(id)
      if (config.uid < 1) {
        return fail(`Board not found.`)
      }
      if (config.level.list > userLevel) {
        return fail(`Level restriction.`, config)
      }

      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
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
      headers: t.Optional(
        t.Object({
          authorization: t.String(),
        }),
      ),
      cookie: t.Optional(
        t.Cookie({
          refresh: t.String(),
        }),
      ),
      query: t.Object({
        id: t.String(),
        page: t.Numeric(),
      }),
    },
  )
