/**
 * server/database/admin/latest/general/post
 *
 * 최신 글 톺아보기에서 게시글 가져오기 처리
 */

import { RowDataPacket } from "mysql2"
import { AdminLatestPost, AdminLatestSearchParams } from "../../../../../src/interface/admin"
import { select, table } from "../../../common"

// 전체 글 개수 반환하기
export async function getTotalPostCount(): Promise<number> {
  let result = 0

  const [total] = await select(`SELECT COUNT(*) AS post_count FROM ${table}post`)
  if (!total) {
    return result
  }
  result = total.post_count
  return result
}

type RelatedResults = {
  id: string
  like: number
  writer: {
    name: string
    profile: string
  }
  comment: number
}

// 게시글에 연관된 내용들 가져오기
async function getRelatedInfo(
  boardUid: number,
  postUid: number,
  userUid: number,
): Promise<RelatedResults> {
  const [board] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [boardUid])
  const [like] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}post_like WHERE post_uid = ? AND liked = 1`,
    [postUid],
  )
  const [writer] = await select(`SELECT name, profile FROM ${table}user WHERE uid = ? LIMIT 1`, [
    userUid,
  ])
  const [comment] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}comment WHERE post_uid = ?`,
    [postUid],
  )

  let result: RelatedResults = {
    id: board.id,
    like: like.total_count,
    writer: {
      name: writer.name,
      profile: writer.profile,
    },
    comment: comment.total_count,
  }

  return result
}

// (검색된) 포스트들 결과로 정리하여 반환하기
async function makePostResult(posts: RowDataPacket[]): Promise<AdminLatestPost[]> {
  let result: AdminLatestPost[] = []
  for (const post of posts) {
    const info = await getRelatedInfo(post.board_uid, post.uid, post.user_uid)
    result.push({
      id: info.id,
      uid: post.uid,
      like: info.like,
      date: post.submitted,
      title: post.title,
      writer: {
        uid: post.user_uid,
        name: info.writer.name,
        profile: info.writer.profile,
      },
      comment: info.comment,
      hit: post.hit,
      removed: post.removed > 0 ? true : false,
    })
  }
  return result
}

// 최신 글 정보 가져오기
export async function getPosts(
  page: number,
  bunch: number,
  total: number,
): Promise<AdminLatestPost[]> {
  let result: AdminLatestPost[] = []
  const last = 1 + total - (page - 1) * bunch
  const posts = await select(
    `SELECT uid, board_uid, user_uid, category_uid, title, content, submitted, hit, removed FROM ${table}post WHERE uid < ? ORDER BY uid DESC LIMIT ?`,
    [last, bunch],
  )
  if (!posts[0]) {
    return result
  }
  result = await makePostResult(posts)
  return result
}

// 검색 결과 가져오기
export async function getSearchedPosts(
  search: AdminLatestSearchParams,
): Promise<AdminLatestPost[]> {
  let result: AdminLatestPost[] = []
  const last = 1 + search.total - (search.page - 1) * search.bunch
  const posts = await select(
    `SELECT uid, board_uid, user_uid, category_uid, title, content, submitted, hit 
    FROM ${table}post WHERE uid < ${last} AND ${search.option} LIKE '%${search.keyword}%' 
    ORDER BY uid DESC LIMIT ${search.bunch}`,
  )
  if (!posts[0]) {
    return result
  }
  result = await makePostResult(posts)
  return result
}
