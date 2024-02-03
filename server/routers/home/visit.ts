/**
 * server/routers/home/visit
 *
 * 사용자 방문 기록하기
 */

import { Elysia, t } from "elysia"
import { isVisitedToday, addAccessLog } from "../../database/home/visit"
import { fail, success } from "../../util/tools"

export const visit = new Elysia().get(
  "/visit",
  async ({ query: { userUid } }) => {
    if (userUid < 1) {
      return fail(`Invalid user uid.`)
    }
    if ((await isVisitedToday(userUid)) === true) {
      return fail(`Already counted.`)
    }
    addAccessLog(userUid)
    return success({})
  },
  {
    query: t.Object({
      userUid: t.Numeric(),
    }),
  },
)
