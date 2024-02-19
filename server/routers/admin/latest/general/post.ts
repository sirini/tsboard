/**
 * server/routers/admin/latest/general/post
 *
 * 최신 글 톺아보기에 필요한 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import {
  getPosts,
  getTotalPostCount,
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
        totalPostCount: 0,
      }

      if (page < 1) {
        return fail(`Invalid page.`, response)
      }
      if (bunch < 5 || bunch > 100) {
        return fail(`Invalid bunch.`, response)
      }

      const totalPostCount = await getTotalPostCount()
      const posts = await getPosts(page, bunch, totalPostCount)
      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        newAccessToken,
        posts,
        totalPostCount,
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
        totalPostCount: 0,
      }

      if (option.length < 2) {
        return fail(`Unknown option.`, response)
      }
      if (keyword.length < 2) {
        return fail(`Keyword is too short.`, response)
      }
      if (page < 1) {
        return fail(`Invalid page.`, response)
      }
      if (bunch < 5 || bunch > 100) {
        return fail(`Invalid bunch.`, response)
      }

      const totalPostCount = await getTotalPostCount()
      const posts = await getSearchedPosts({
        option,
        keyword,
        page,
        bunch,
        total: totalPostCount,
      })
      return success({
        posts,
        totalPostCount,
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
