import { Elysia, t } from "elysia"
import { BoardType, SearchOption } from "../../../src/interface/board"
import { BoardLatestPost, BoardPostItem } from "../../../src/interface/home"
import { BOARD_TYPE } from "../../database/board/const"
import {
  getBoardLatestPosts,
  getLatestPost,
  getMaxUid
} from "../../database/home/list"
import { fail, success } from "../../util/tools"

export const listRouter = new Elysia()
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
    "/latest/post",
    async ({ query: { id, limit, accessUserUid } }) => {
      let response: BoardLatestPost = {
        id: "",
        type: BOARD_TYPE.BOARD as BoardType,
        name: "",
        info: "",
        useCategory: false,
        posts: [] as BoardPostItem[],
      }
      if (id.length < 2 || limit < 1) {
        return fail(`Invalid parameters.`, response)
      }

      response = await getBoardLatestPosts(id, limit, accessUserUid)
      return success(response)
    },
    {
      query: t.Object({
        id: t.String(),
        limit: t.Numeric(),
        accessUserUid: t.Numeric(),
      }),
    },
  )