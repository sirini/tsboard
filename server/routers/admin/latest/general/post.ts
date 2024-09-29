/**
 * server/routers/admin/latest/general/post
 *
 * 최신 글 톺아보기에 필요한 라우팅 처리
 */

import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import {
  getMaxPostUid,
  getPosts,
  getSearchedPosts,
} from "../../../../database/admin/latest/general/post"
import { removePost } from "../../../../database/board/view"
import { DEFAULT_TYPE_CHECK, fail, success } from "../../../../util/tools"

export const post = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/post",
    async ({ query: { page, bunch } }) => {
      const response = {
        posts: [],
        maxPostUid: 0,
      }

      if (page < 1 || bunch < 5 || bunch > 100) {
        return fail(`Invalid parameters.`, response)
      }

      const maxPostUid = await getMaxPostUid()
      const posts = await getPosts(page, bunch, maxPostUid)

      return success({
        posts,
        maxPostUid,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
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
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        option: t.String(),
        keyword: t.String(),
        page: t.Numeric(),
        bunch: t.Numeric(),
      }),
    },
  )
  .delete(
    "/remove/post",
    async ({ query: { targets } }) => {
      const response = ""
      if (targets.length < 1) {
        return fail(`Targets is empty.`, response)
      }

      const uids = targets.split(",")
      for (const uid of uids) {
        await removePost(parseInt(uid))
      }

      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        targets: t.String(),
      }),
    },
  )
