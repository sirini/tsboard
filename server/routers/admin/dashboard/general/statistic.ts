/**
 * server/routers/admin/home/general/statistic
 *
 * 관리화면 첫페이지의 통계 부분 데이터 가져오기
 */

import { Elysia } from "elysia"
import {
  getVisitStat,
  getMemberStat,
  getPostStat,
} from "../../../../database/admin/dashboard/general/statistic"
import { success } from "../../../../util/tools"

export const statistic = new Elysia().get("/load", async () => {
  const now = new Date()
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const today = day.getTime()
  const yesterday = new Date(day).setDate(day.getDate() - 1)
  const daybefore = new Date(day).setDate(day.getDate() - 2)

  const visit = await getVisitStat({ today, yesterday, daybefore })
  const member = await getMemberStat({ today, yesterday, daybefore })
  const post = await getPostStat({ today, yesterday, daybefore })

  return success({
    visit,
    member,
    post,
  })
})
