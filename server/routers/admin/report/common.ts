/**
 * server/routers/admin/report/solved
 *
 * 신고 목록 중에서 해결된 건들 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import {
  getTotalReportCount,
  getReports,
  getSearchedReports,
} from "../../../database/admin/report/common"
import { fail, success, updateAccessToken } from "../../../util/tools"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

export const common = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/list",
    async ({ jwt, cookie: { refresh }, headers, query: { page, bunch, isSolved } }) => {
      if (page < 1) {
        return fail(`Invalid page.`)
      }
      if (bunch < 5 || bunch > 100) {
        return fail(`Invalid bunch.`)
      }
      const solved = isSolved > 0 ? true : false
      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      const totalReportCount = await getTotalReportCount(solved)
      const reports = await getReports({
        page,
        bunch,
        total: totalReportCount,
        isSolved: solved,
      })

      return success({
        newAccessToken,
        reports,
        totalReportCount,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        page: t.Numeric(),
        bunch: t.Numeric(),
        isSolved: t.Numeric(),
      }),
    },
  )
  .get(
    "/search/list",
    async ({
      jwt,
      cookie: { refresh },
      headers,
      query: { option, keyword, page, bunch, isSolved },
    }) => {
      if (option.length < 2) {
        return fail(`Unknown option.`)
      }
      if (keyword.length < 2) {
        return fail(`Keyword is too short.`)
      }
      if (page < 1) {
        return fail(`Invalid page.`)
      }
      if (bunch < 5 || bunch > 100) {
        return fail(`Invalid bunch.`)
      }
      const solved = isSolved > 0 ? true : false
      const totalReportCount = await getTotalReportCount(solved)
      const reports = await getSearchedReports(
        {
          option,
          keyword,
          page,
          bunch,
          total: totalReportCount,
        },
        solved,
      )

      return success({
        reports,
        totalReportCount,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        option: t.String(),
        keyword: t.String(),
        page: t.Numeric(),
        bunch: t.Numeric(),
        isSolved: t.Numeric(),
      }),
    },
  )
