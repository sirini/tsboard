/**
 * server/routers/user/report
 *
 * 회원 신고하기 관련 라우팅
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { addBlackList, sendReport } from "../../database/user/report"
import { fail, success, DEFAULT_TYPE_CHECK, getUpdatedAccessToken } from "../../util/tools"
import { havePermission } from "../../database/board/common"

export const report = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers, cookie }) => {
    let accessUserUid = 0
    let newAccessToken = ""

    const access = await jwt.verify(headers.authorization ?? "")
    if (access === false) {
      return {
        accessUserUid,
        newAccessToken,
      }
    }
    accessUserUid = access.uid as number
    if (cookie && cookie.refresh) {
      newAccessToken = await getUpdatedAccessToken(
        jwt,
        headers.authorization as string,
        cookie.refresh.value,
      )
    }
    return {
      accessUserUid,
      newAccessToken,
    }
  })
  .post(
    "/report",
    async ({ body: { userUid, content, checkedBlackList }, accessUserUid, newAccessToken }) => {
      let response = {
        newAccessToken,
      }
      if (userUid < 1 || content.length < 2 || checkedBlackList < 0 || checkedBlackList > 1) {
        return fail(`Invalid parameters.`, response)
      }
      if ((await havePermission(accessUserUid, "send_report")) === false) {
        return fail(`You have no permission.`, response)
      }
      if (checkedBlackList === 1) {
        addBlackList(accessUserUid, userUid)
      }
      sendReport(accessUserUid, userUid, content)
      return success(response)
    },
    {
      ...DEFAULT_TYPE_CHECK,
      body: t.Object({
        userUid: t.Numeric(),
        content: t.String(),
        checkedBlackList: t.Numeric(),
      }),
    },
  )
