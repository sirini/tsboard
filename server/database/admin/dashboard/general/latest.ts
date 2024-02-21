/**
 * server/database/admin/home/general/latest
 *
 * 관리화면 첫페이지 > 최근 게시글, 댓글, 신고글에 필요한 함수들
 */

import { AdminLatest, AdminUserInfo } from "../../../../../src/interface/admin"
import { table, select } from "../../../common"

// 작성자 정보 가져오기
async function getWriterInfo(userUid: number): Promise<AdminUserInfo> {
  let result: AdminUserInfo = {
    uid: 0,
    name: "",
    profile: "",
  }
  const [writer] = await select(
    `SELECT uid, name, profile FROM ${table}user WHERE uid = ? LIMIT 1`,
    [userUid],
  )
  if (!writer) {
    return result
  }
  return {
    uid: writer.uid,
    name: writer.name,
    profile: writer.profile,
  }
}

// 대시보드에서 볼 최신 글 목록 가져오기
export async function getLatestPosts(limit: number): Promise<AdminLatest[]> {
  let result: AdminLatest[] = []

  const posts = await select(
    `SELECT uid, board_uid, user_uid, title FROM ${table}post ORDER BY uid DESC LIMIT ?`,
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
    const writer = await getWriterInfo(post.user_uid)
    result.push({
      uid: post.uid,
      id: board.id,
      content: post.title,
      writer,
    })
  }

  return result
}

// 대시보드에서 볼 최신 댓글 목록 가져오기
export async function getLatestComments(limit: number): Promise<AdminLatest[]> {
  let result: AdminLatest[] = []

  const comments = await select(
    `SELECT uid, post_uid, user_uid, content FROM ${table}comment ORDER BY uid DESC LIMIT ?`,
    [limit],
  )
  if (!comments[0]) {
    return result
  }

  for (const comment of comments) {
    const [board] = await select(`SELECT board_uid FROM ${table}post WHERE uid = ? LIMIT 1`, [
      comment.post_uid,
    ])
    if (!board) {
      continue
    }
    const [bid] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [
      board.board_uid,
    ])
    if (!bid) {
      continue
    }
    const writer = await getWriterInfo(comment.user_uid)
    result.push({
      uid: comment.post_uid,
      id: bid.id,
      content: comment.content,
      writer,
    })
  }

  return result
}

// 대시보드에서 볼 최신 신고 내역 가져오기
export async function getLatestReports(limit: number): Promise<AdminLatest[]> {
  let result: AdminLatest[] = []
  const reports = await select(
    `SELECT uid, from_uid, request FROM ${table}report ORDER BY uid DESC LIMIT ?`,
    [limit],
  )
  if (!reports[0]) {
    return result
  }

  for (const report of reports) {
    const writer = await getWriterInfo(report.from_uid)
    result.push({
      uid: report.uid,
      content: report.request,
      writer,
    })
  }

  return result
}
