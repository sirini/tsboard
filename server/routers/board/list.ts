/**
 * server/routers/board/list
 *
 * 게시판 목록보기 처리
 */

import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"
import { Post, SearchOption } from "../../../src/interface/board"
import { checkUserVerification } from "../../database/auth/authorization"
import { BOARD_CONFIG } from "../../database/board/const"
import {
  getBlackList,
  getBoardConfig,
  getMaxPostUid,
  getPosts,
  getTotalPostCount,
  getUserLevel,
} from "../../database/board/list"
import { haveAdminPermission } from "../../database/user/manageuser"
import { fail, success } from "../../util/tools"

export const listRouter = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0
    let userLevel = 0
    let newAccessToken = ""

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value ?? "",
    })

    if (verification.success === true) {
      accessUserUid = verification.accessUserUid
      userLevel = await getUserLevel(accessUserUid)
      newAccessToken = verification.newAccessToken
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
      query: { id, page, pagingDirection, sinceUid, option, keyword },
      accessUserUid,
      userLevel,
      newAccessToken,
    }) => {
      let response = {
        totalPostCount: 0,
        config: BOARD_CONFIG,
        posts: [] as Post[],
        newAccessToken,
        blackList: [] as number[],
        isAdmin: false,
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

      if (sinceUid < 1) {
        sinceUid = (await getMaxPostUid(config.uid)) + 1
      }

      const totalPostCount = await getTotalPostCount(config.uid)
      const searchOption = option as SearchOption
      const posts = await getPosts({
        boardUid: config.uid,
        page,
        bunch: config.rowCount,
        sinceUid,
        accessUserUid,
        pagingDirection,
        option: searchOption,
        keyword,
      })
      let blackList: number[] = []
      if (accessUserUid > 0) {
        blackList = await getBlackList(accessUserUid)
      }

      const isAdmin = await haveAdminPermission(accessUserUid, config.uid)
      return success({
        totalPostCount,
        config,
        posts,
        newAccessToken,
        blackList,
        isAdmin,
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
        userUid: t.Numeric(),
      }),
    },
  )
