/**
 * server/database/admin/latest/general/comment
 *
 * 최신 댓글 톺아보기에서 코멘트 가져오기 처리
 */

import { RowDataPacket } from "mysql2"
import {
  AdminLatestComment,
  AdminSearchCommon,
  AdminUserInfo,
} from "../../../../../src/interface/admin"
import { select, table } from "../../../common"
import { getUserBasic } from "../../../board/list"
import { getCommentLikeCount } from "../../../board/comment"

// 최근 uid 값 반환하기
export async function getMaxCommentUid(): Promise<number> {
  const [max] = await select(`SELECT MAX(uid) AS uid FROM ${table}comment`)
  if (!max) {
    return 0
  }
  return max.uid
}

type RelatedResults = {
  id: string
  like: number
  writer: AdminUserInfo
}

// 댓글에 연관된 내용들 가져오기
async function getRelatedInfo(
  postUid: number,
  commentUid: number,
  userUid: number,
): Promise<RelatedResults> {
  const [post] = await select(`SELECT board_uid FROM ${table}post WHERE uid = ? LIMIT 1`, [postUid])
  const [board] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [
    post.board_uid,
  ])
  const like = await getCommentLikeCount(commentUid)
  const writer = await getUserBasic(userUid)

  let result: RelatedResults = {
    id: board.id,
    like,
    writer: writer as AdminUserInfo,
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
    [last, bunch],
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
