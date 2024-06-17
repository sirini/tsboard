/**
 * server/routers/user/report
 *
 * 회원 신고하기 관련 라우팅
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { addBlackList, sendReport } from "../../database/user/report"
import { fail, success, EXTEND_TYPE_CHECK } from "../../util/tools"
import { havePermission } from "../../database/board/common"
import { checkUserVerification } from "../../database/auth/authorization"

export const report = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ jwt, headers: { authorization }, cookie: { refresh }, query: { userUid } }) => {
    let accessUserUid = 0
    let newAccessToken = ""

    const verification = await checkUserVerification({
      jwt,
      userUid: parseInt(userUid ?? "0"),
      accessToken: authorization ?? "",
      refreshToken: refresh.value,
    })

    if (verification.success === true) {
      accessUserUid = verification.accessUserUid
      newAccessToken = verification.newAccessToken
    }

    return {
      accessUserUid,
      newAccessToken,
    }
  })
  .post(
    "/report",
    async ({
      body: { targetUserUid, content, checkedBlackList },
      accessUserUid,
      newAccessToken,
    }) => {
      let response = {
        newAccessToken,
      }
      if (targetUserUid < 1 || content.length < 2 || checkedBlackList < 0 || checkedBlackList > 1) {
        return fail(`Invalid parameters.`, response)
      }
      if ((await havePermission(accessUserUid, "send_report")) === false) {
        return fail(`You have no permission.`, response)
      }
      if (checkedBlackList === 1) {
        addBlackList(accessUserUid, targetUserUid)
      }
      sendReport(accessUserUid, targetUserUid, content)
      return success(response)
    },
    {
      ...EXTEND_TYPE_CHECK,
      body: t.Object({
        targetUserUid: t.Numeric(),
        content: t.String(),
        checkedBlackList: t.Numeric(),
      }),
    },
  )
