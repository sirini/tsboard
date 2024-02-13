/**
 * server/database/admin/home/general/statistic
 *
 * 관리화면 첫페이지 > 통계 데이터에 필요한 함수들
 */

import { AdminDashboardStat, AdminDate } from "../../../../../src/interface/admin"
import { table, update, select, remove, insert } from "../../../common"

// 방문자수 통계 반환하기
export async function getVisitStat(date: AdminDate): Promise<AdminDashboardStat> {
  const [today] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}user_access_log WHERE timestamp > ?`,
    [date.today],
  )
  const [yesterday] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}user_access_log WHERE timestamp BETWEEN ? AND ?`,
    [date.yesterday, date.today],
  )
  const [daybefore] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}user_access_log WHERE timestamp BETWEEN ? AND ?`,
    [date.daybefore, date.yesterday],
  )

  return {
    today: today.total_count,
    yesterday: yesterday.total_count,
    total: daybefore.total_count,
  }
}

// 통계 정보 가져오기
export async function getStatistic(
  date: AdminDate,
  name: string,
  where: string,
): Promise<AdminDashboardStat> {
  const [today] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}${name} WHERE ${where} > ?`,
    [date.today],
  )
  const [yesterday] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}${name} WHERE ${where} BETWEEN ? AND ?`,
    [date.yesterday, date.today],
  )
  const [all] = await select(`SELECT COUNT(*) AS total_count FROM ${table}${name}`)
  return {
    today: today.total_count,
    yesterday: yesterday.total_count,
    total: all.total_count,
  }
}
