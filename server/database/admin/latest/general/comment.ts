/**
 * server/database/admin/latest/general/comment
 *
 * 최신 댓글 톺아보기에서 코멘트 가져오기 처리
 */

import { RowDataPacket } from "mysql2"
import {
  AdminLatestComment,
  AdminLatestRelatedResults,
  AdminSearchCommon,
  AdminUserInfo,
} from "../../../../../src/interface/admin"
import { select, table } from "../../../common"
import { getUserBasic } from "../../../board/list"
import { getCommentLikeCount } from "../../../board/comment"
import { BoardType } from "../../../../../src/interface/board"

// 최근 uid 값 반환하기
export async function getMaxCommentUid(): Promise<number> {
  const [max] = await select(`SELECT MAX(uid) AS uid FROM ${table}comment`)
  if (!max) {
    return 0
  }
  return max.uid
}

// 댓글에 연관된 내용들 가져오기
async function getRelatedInfo(
  postUid: number,
  commentUid: number,
  userUid: number,
): Promise<AdminLatestRelatedResults> {
  const [post] = await select(`SELECT board_uid FROM ${table}post WHERE uid = ? LIMIT 1`, [
    postUid.toString(),
  ])
  const [board] = await select(`SELECT id, type FROM ${table}board WHERE uid = ? LIMIT 1`, [
    post.board_uid,
  ])
  const like = await getCommentLikeCount(commentUid)
  const writer = await getUserBasic(userUid)

  let result: AdminLatestRelatedResults = {
    id: board.id,
    type: board.type as BoardType,
    like,
    writer: writer as AdminUserInfo,
    comment: 0,
  }

  return result
}

// (검색된) 댓글들 결과로 정리하여 반환하기
async function makeCommentResult(comments: RowDataPacket[]): Promise<AdminLatestComment[]> {
  let result: AdminLatestComment[] = []
  for (const comment of comments) {
    const info = await getRelatedInfo(comment.post_uid, comment.uid, comment.user_uid)
    result.push({
      id: info.id,
      type: info.type,
      uid: comment.uid,
      like: info.like,
      date: comment.submitted,
      content: comment.content,
      writer: info.writer,
      status: comment.status,
    })
  }
  return result
}

// 최신 댓글 정보 가져오기
export async function getComments(
  page: number,
  bunch: number,
  maxUid: number,
): Promise<AdminLatestComment[]> {
  let result: AdminLatestComment[] = []
  const last = 1 + maxUid - (page - 1) * bunch
  const comments = await select(
    `SELECT uid, post_uid, user_uid, content, submitted, status FROM ${table}comment WHERE uid < ? ORDER BY uid DESC LIMIT ?`,
    [last.toString(), bunch.toString()],
  )
  if (!comments[0]) {
    return result
  }

  result = await makeCommentResult(comments)
  return result
}

// 검색 결과 가져오기
export async function getSearchedComments(
  search: AdminSearchCommon,
): Promise<AdminLatestComment[]> {
  let result: AdminLatestComment[] = []
  const last = 1 + search.maxUid - (search.page - 1) * search.bunch
  const comments = await select(`SELECT uid, post_uid, user_uid, content, submitted, status 
  FROM ${table}comment WHERE uid < ${last} AND ${search.option} LIKE '%${search.keyword}%'
  ORDER BY uid DESC LIMIT ${search.bunch}`)
  if (!comments[0]) {
    return result
  }

  result = await makeCommentResult(comments)
  return result
}
