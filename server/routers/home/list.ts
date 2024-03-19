/**
 * server/routers/home/list
 *
 * 첫화면 최신글 보기 등 라우팅
 */

import { Elysia, t } from "elysia"
import { getMaxUid } from "../../database/home/list"

export const list = new Elysia().get(
  "/latest",
  async ({ query: { sinceUid, bunch } }) => {
    if (sinceUid < 1) {
      sinceUid = (await getMaxUid()) + 1
    }
    
  },
  {
    query: t.Object({
      sinceUid: t.Numeric(),
      bunch: t.Numeric(),
    }),
  },
)
