/**
 * server/database/admin/latest/general/comment
 *
 * 최신 댓글 톺아보기에서 코멘트 가져오기 처리
 */

import { RowDataPacket } from "mysql2"
import { AdminLatestComment, AdminLatestSearchParams } from "../../../../../src/interface/admin"
import { select, table } from "../../../common"

// 전체 댓글 개수 반환하기
export async function getTotalCommentCount(): Promise<number> {
  let result = 0

  const [total] = await select(`SELECT COUNT(*) AS comment_count FROM ${table}comment`)
  if (!total) {
    return result
  }
  result = total.comment_count
  return result
}

type RelatedResults = {
  id: string
  like: number
  writer: {
    name: string
    profile: string
  }
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
  const [like] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}comment_like WHERE comment_uid = ? AND liked = 1`,
    [commentUid],
  )
  const [writer] = await select(`SELECT name, profile FROM ${table}user WHERE uid = ? LIMIT 1`, [
    userUid,
  ])

  let result: RelatedResults = {
    id: board.id,
    like: like.total_count,
    writer: {
      name: writer.name,
      profile: writer.profile,
    },
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
      writer: {
        uid: comment.user_uid,
        name: info.writer.name,
        profile: info.writer.profile,
      },
      removed: comment.removed > 0 ? true : false,
    })
  }
  return result
}

// 최신 댓글 정보 가져오기
export async function getComments(
  page: number,
  bunch: number,
  total: number,
): Promise<AdminLatestComment[]> {
  let result: AdminLatestComment[] = []
  const last = 1 + total - (page - 1) * bunch
  const comments = await select(
    `SELECT uid, post_uid, user_uid, content, submitted, removed FROM ${table}comment WHERE uid < ? ORDER BY uid DESC LIMIT ?`,
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
  search: AdminLatestSearchParams,
): Promise<AdminLatestComment[]> {
  let result: AdminLatestComment[] = []
  const last = 1 + search.total - (search.page - 1) * search.bunch
  const comments = await select(`SELECT uid, post_uid, user_uid, content, submitted, removed 
  FROM ${table}comment WHERE uid < ${last} AND ${search.option} LIKE '%${search.keyword}%'
  ORDER BY uid DESC LIMIT ${search.bunch}`)
  if (!comments[0]) {
    return result
  }
  result = await makeCommentResult(comments)
  return result
}
