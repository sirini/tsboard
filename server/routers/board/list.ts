/**
 * server/routers/board/list
 *
 * 게시판 목록보기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { getBoardConfig, getPostCount, getPosts, getUserLevel } from "../../database/board/list"
import { fail, success } from "../../util/tools"

export const list = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/list",
    async ({ jwt, cookie: { refresh }, headers, query: { id, page } }) => {
      if (id.length < 2) {
        return fail(`Invalid board ID.`)
      }
      const config = await getBoardConfig(id)
      if (config.uid < 1) {
        return fail(`Board not found.`)
      }
      if (config.level.list > 0) {
        if (headers.authorization.length < 1 || refresh.value.length < 1) {
          return fail(JSON.stringify(config))
        }

        const access = await jwt.verify(headers.authorization)
        if (access === false) {
          return fail(`Invalid authorization.`)
        }

        const userLevel = await getUserLevel(access.uid as number)
        if (config.level.list > userLevel) {
          return fail(`Level restrictions.`)
        }
      }

      const total = await getPostCount(config.uid)
      const posts = await getPosts({
        boardUid: config.uid,
        page,
        bunch: config.row,
        total,
      })
      return success({
        total,
        config,
        posts,
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
