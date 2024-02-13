/**
 * server/routers/admin/home/general/statistic
 *
 * 관리화면 첫페이지의 통계 부분 데이터 가져오기
 */

import { Elysia } from "elysia"
import { getVisitStat, getStatistic } from "../../../../database/admin/dashboard/general/statistic"
import { success } from "../../../../util/tools"

export const statistic = new Elysia().get("/load/statistic", async () => {
  const now = new Date()
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const today = day.getTime()
  const yesterday = new Date(day).setDate(day.getDate() - 1)
  const daybefore = new Date(day).setDate(day.getDate() - 2)

  const date = { today, yesterday, daybefore }
  const visit = await getVisitStat(date)
  const member = await getStatistic(date, "user", "signup")
  const post = await getStatistic(date, "post", "submitted")
  const reply = await getStatistic(date, "comment", "submitted")
  const file = await getStatistic(date, "file", "timestamp")
  const image = await getStatistic(date, "image", "timestamp")

  return success({
    visit,
    member,
    post,
    reply,
    file,
    image,
  })
})
