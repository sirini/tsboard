/**
 * server/database/admin/report/waiting
 *
 * 신고 목록에서 아직 해결되지 않은 것들 처리
 */

import { RowDataPacket } from "mysql2"
import { AdminReport, AdminReportParams } from "../../../../src/interface/admin"
import { select, table } from "../../common"

// 유효한 최대 uid 값 반환
export async function getMaxReportUid(isSolved: boolean): Promise<number> {
  const [max] = await select(
    `SELECT MAX(uid) AS uid FROM ${table}report WHERE solved ${isSolved ? "=" : "<"} 1`,
  )
  if (!max) {
    return 0
  }
  return max.uid
}

// (검색된) 신고들 결과로 정리하여 반환하기
async function makeReportResult(reports: RowDataPacket[]): Promise<AdminReport[]> {
  let result: AdminReport[] = []
  for (const report of reports) {
    const [to] = await select(`SELECT uid, name, profile FROM ${table}user WHERE uid = ? LIMIT 1`, [
      report.to_uid,
    ])
    const [from] = await select(
      `SELECT uid, name, profile FROM ${table}user WHERE uid = ? LIMIT 1`,
      [report.from_uid],
    )

    result.push({
      to: {
        uid: to.uid,
        name: to.name,
        profile: to.profile,
      },
      from: {
        uid: from.uid,
        name: from.name,
        profile: from.profile,
      },
      request: report.request,
      response: report.response,
      date: report.timestamp,
    })
  }
  return result
}

// 신고 목록들 가져오기
export async function getReports(param: AdminReportParams): Promise<AdminReport[]> {
  let result: AdminReport[] = []
  const last = 1 + param.maxUid - (param.page - 1) * param.bunch
  const reports = await select(
    `SELECT uid, to_uid, from_uid, request, response, timestamp FROM ${table}report WHERE uid < ${last} AND solved ${
      param.isSolved ? "=" : "<"
    } 1 ORDER BY uid DESC LIMIT ${param.bunch}`,
  )
  if (!reports[0]) {
    return result
  }
  result = await makeReportResult(reports)
  return result
}

// 사용자 고유번호 조회해서 where 절 반환하기
async function getUserUid(target: string, name: string): Promise<string> {
  if (target !== "to" && target !== "from") {
    return ""
  }
  let where = ""
  const [user] = await select(`SELECT uid FROM ${table}user WHERE name LIKE '%${name}%' LIMIT 1`)
  if (user) {
    where = `AND ${target}_uid = ${user.uid}`
  }
  return where
}

// 검색 결과 가져오기
export async function getSearchedReports(search: AdminReportParams): Promise<AdminReport[]> {
  let result: AdminReport[] = []
  const last = 1 + search.maxUid - (search.page - 1) * search.bunch
  const whereUser = await getUserUid(search.option, search.keyword)
  let whereRequest = ""
  if (search.option === "request") {
    whereRequest = `AND request LIKE '%${search.keyword}%'`
  }
  const reports = await select(
    `SELECT uid, to_uid, from_uid, request, response, timestamp FROM ${table}report WHERE uid < ${last} AND solved ${
      search.isSolved ? "=" : "<"
    } 1 ${whereUser} ${whereRequest} ORDER BY uid DESC LIMIT ${search.bunch}`,
  )

  if (!reports[0]) {
    return result
  }
  result = await makeReportResult(reports)
  return result
}
