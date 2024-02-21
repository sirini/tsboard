/**
 * server/routers/admin/latest/general/post
 *
 * 최신 글 톺아보기에 필요한 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import {
  getPosts,
  getMaxPostUid,
  getSearchedPosts,
} from "../../../../database/admin/latest/general/post"
import { fail, success, getUpdatedAccessToken } from "../../../../util/tools"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

export const post = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/post",
    async ({ jwt, cookie: { refresh }, headers, query: { page, bunch } }) => {
      const response = {
        newAccessToken: "",
        posts: [],
        maxPostUid: 0,
      }

      if (page < 1 || bunch < 5 || bunch > 100) {
        return fail(`Invalid parameters.`, response)
      }

      const maxPostUid = await getMaxPostUid()
      const posts = await getPosts(page, bunch, maxPostUid)
      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        newAccessToken,
        posts,
        maxPostUid,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        page: t.Numeric(),
        bunch: t.Numeric(),
      }),
    },
  )
  .get(
    "/search/post",
    async ({ query: { option, keyword, page, bunch } }) => {
      const response = {
        posts: [],
        maxPostUid: 0,
      }

      if (option.length < 2 || keyword.length < 2 || page < 1 || bunch < 5 || bunch > 100) {
        return fail(`Invalid parameters.`, response)
      }

      const maxPostUid = await getMaxPostUid()
      const posts = await getSearchedPosts({
        option,
        keyword,
        page,
        bunch,
        maxUid: maxPostUid,
      })
      return success({
        posts,
        maxPostUid,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        option: t.String(),
        keyword: t.String(),
        page: t.Numeric(),
        bunch: t.Numeric(),
      }),
    },
  )
