/**
 * server/database/admin/home/general/statistic
 *
 * 관리화면 첫페이지 > 통계 데이터에 필요한 함수들
 */

import {
  AdminDashboardStatus,
  AdminDashboardStatusItem,
  AdminDashboardTableColumn,
  AdminDashboardTableName,
} from "../../../../../src/interface/admin"
import { select, table } from "../../../common"

// 방문자수 통계 반환
export async function getStatistic(
  target: AdminDashboardTableName,
  column: AdminDashboardTableColumn,
  range: number,
): Promise<AdminDashboardStatus> {
  let history: AdminDashboardStatusItem[] = []
  let total = 0
  const now = new Date()
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [today] = await select(
    `SELECT COUNT(*) AS total FROM ${table}${target} WHERE ${column} > ?`,
    [day.getTime().toString()],
  )
  history.push({
    date: day.getTime(),
    visit: today.total,
  })

  const [all] = await select(`SELECT COUNT(*) AS total FROM ${table}${target}`)
  total = all.total

  for (let d = 1; d < range; d++) {
    const start = new Date(day).setDate(day.getDate() - d)
    const end = new Date(day).setDate(day.getDate() - (d + 1))
    const [before] = await select(
      `SELECT COUNT(*) AS total FROM ${table}${target} WHERE ${column} BETWEEN ? AND ?`,
      [end.toString(), start.toString()],
    )
    history.push({
      date: start,
      visit: before.total,
    })
  }

  return { history, total }
}
