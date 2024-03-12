/**
 * server/routers/admin/report/solved
 *
 * 신고 목록 중에서 해결된 건들 라우팅 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import {
  getReports,
  getSearchedReports,
  getMaxReportUid,
} from "../../../database/admin/report/common"
import { fail, success, getUpdatedAccessToken, DEFAULT_TYPE_CHECK } from "../../../util/tools"

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
      const response = {
        newAccessToken: "",
        reports: [],
        maxReportUid: 0,
      }

      if (page < 1 || bunch < 5 || bunch > 100) {
        return fail(`Invalid parameters.`, response)
      }
      const solved = isSolved > 0 ? true : false
      const newAccessToken = await getUpdatedAccessToken(jwt, headers.authorization, refresh.value)
      const maxReportUid = await getMaxReportUid(solved)
      const reports = await getReports({
        page,
        bunch,
        maxUid: maxReportUid,
        option: "",
        keyword: "",
        isSolved: solved,
      })

      return success({
        newAccessToken,
        reports,
        maxReportUid,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        page: t.Numeric(),
        bunch: t.Numeric(),
        isSolved: t.Numeric(),
      }),
    },
  )
  .get(
    "/search/list",
    async ({ query: { option, keyword, page, bunch, isSolved } }) => {
      const response = {
        reports: [],
        maxReportUid: 0,
      }

      if (option.length < 2 || keyword.length < 2 || page < 1 || bunch < 5 || bunch > 100) {
        return fail(`Invalid parameters.`, response)
      }
      const solved = isSolved > 0 ? true : false
      const maxReportUid = await getMaxReportUid(solved)
      const reports = await getSearchedReports({
        option,
        keyword,
        page,
        bunch,
        maxUid: maxReportUid,
        isSolved: solved,
      })

      return success({
        reports,
        maxReportUid,
      })
    },
    {
      ...DEFAULT_TYPE_CHECK,
      query: t.Object({
        option: t.String(),
        keyword: t.String(),
        page: t.Numeric(),
        bunch: t.Numeric(),
        isSolved: t.Numeric(),
      }),
    },
  )
