/**
 * server/database/admin/home/general/latest
 *
 * 관리화면 첫페이지 > 최근 게시글, 댓글, 신고글에 필요한 함수들
 */

import { AdminLatest, AdminPairItem } from "../../../../../src/interface/admin"
import { table, update, select, remove, insert } from "../../../common"

// 대시보드에서 볼 최신 글 목록 가져오기
export async function getLatestPosts(limit: number): Promise<AdminLatest[]> {
  let result: AdminLatest[] = []

  const posts = await select(
    `SELECT uid, board_uid, title FROM ${table}post ORDER BY uid DESC LIMIT ?`,
    [limit],
  )
  if (!posts[0]) {
    return result
  }

  for (const post of posts) {
    const [board] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [
      post.board_uid,
    ])
    if (!board) {
      continue
    }
    result.push({
      uid: post.uid,
      id: board.id,
      content: post.title,
    })
  }

  return result
}

// 대시보드에서 볼 최신 댓글 목록 가져오기
export async function getLatestComments(limit: number): Promise<AdminLatest[]> {
  let result: AdminLatest[] = []

  const comments = await select(
    `SELECT uid, post_uid, content FROM ${table}comment ORDER BY uid DESC LIMIT ?`,
    [limit],
  )
  if (!comments[0]) {
    return result
  }

  for (const comment of comments) {
    const [board] = await select(
      `SELECT board_uid AS uid FROM ${table}post WHERE uid = ? LIMIT 1`,
      [comment.post_uid],
    )
    if (!board) {
      continue
    }
    const [bid] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [board.uid])
    if (!bid) {
      continue
    }
    result.push({
      uid: comment.post_uid,
      id: bid.id,
      content: comment.content,
    })
  }

  return result
}

// 대시보드에서 볼 최신 신고 내역 가져오기
export async function getLatestReports(limit: number): Promise<AdminLatest[]> {
  let result: AdminLatest[] = []

  const reports = await select(
    `SELECT uid, request FROM ${table}report ORDER BY uid DESC LIMIT ?`,
    [limit],
  )
  if (!reports[0]) {
    return result
  }

  for (const report of reports) {
    result.push({
      uid: report.uid,
      content: report.request,
    })
  }

  return result
}
