/**
 * server/routers/home/list
 *
 * 첫화면 최신글 보기 등 라우팅
 */

import { Elysia, t } from "elysia"
import { getBoardLatests, getLatestPost, getMaxUid } from "../../database/home/list"
import { fail, success } from "../../util/tools"
import { LatestPost } from "../../../src/interface/home"
import { SearchOption } from "../../../src/interface/board"

export const list = new Elysia()
  .get(
    "/latest",
    async ({ query: { sinceUid, bunch, option, keyword, accessUserUid } }) => {
      if (sinceUid < 1) {
        sinceUid = (await getMaxUid()) + 1
      }

      const searchOption = option as SearchOption
      const posts = await getLatestPost({
        sinceUid,
        bunch,
        option: searchOption,
        keyword,
        accessUserUid,
      })
      return success(posts)
    },
    {
      query: t.Object({
        sinceUid: t.Numeric(),
        bunch: t.Numeric(),
        option: t.Numeric(),
        keyword: t.String(),
        accessUserUid: t.Numeric(),
      }),
    },
  )
  .get(
    "/latest/board",
    async ({ query: { id, limit } }) => {
      let response = {
        name: "",
        latest: [] as LatestPost[],
      }
      if (id.length < 2 || limit < 1) {
        return fail(`Invalid parameters.`, response)
      }

      response = await getBoardLatests(id, limit)
      return success(response)
    },
    {
      query: t.Object({
        id: t.String(),
        limit: t.Numeric(),
      }),
    },
  )
