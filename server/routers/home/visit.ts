/**
 * server/routers/home/visit
 *
 * 사용자 방문 기록하기
 */

import { Elysia, t } from "elysia"
import { addAccessLog } from "../../database/home/visit"

export const visit = new Elysia().get(
  "/visit",
  async ({ query: { userUid } }) => {
    addAccessLog(userUid)
    return {}
  },
  {
    query: t.Object({
      userUid: t.Numeric(),
    }),
  },
)
