/**
 * server/routers/admin/home/general/statistic
 *
 * 관리화면 첫페이지의 통계 부분 데이터 가져오기
 */

import { Elysia } from "elysia"
import { getStatistic } from "../../../../database/admin/dashboard/general/statistic"
import { success } from "../../../../util/tools"

export const statistic = new Elysia().get("/load/statistic", async () => {
  const visit = await getStatistic("user_access_log", "timestamp", 7)
  const member = await getStatistic("user", "signup", 7)
  const post = await getStatistic("post", "submitted", 7)
  const reply = await getStatistic("comment", "submitted", 7)
  const file = await getStatistic("file", "timestamp", 7)
  const image = await getStatistic("image", "timestamp", 7)

  return success({
    visit,
    member,
    post,
    reply,
    file,
    image,
  })
})
