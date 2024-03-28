/**
 * server/database/admin/latest/general/post
 *
 * 최신 글 톺아보기에서 게시글 가져오기 처리
 */

import { RowDataPacket } from "mysql2"
import {
  AdminLatestPost,
  AdminSearchCommon,
  AdminUserInfo,
} from "../../../../../src/interface/admin"
import { select, table } from "../../../common"
import { getPostLikeCount, getUserBasic } from "../../../board/list"
import { getTotalCommentCount } from "../../../board/comment"

// 전체 글 개수 반환하기
export async function getMaxPostUid(): Promise<number> {
  const [max] = await select(`SELECT MAX(uid) AS uid FROM ${table}post`)
  if (!max) {
    return 0
  }
  return max.uid
}

type RelatedResults = {
  id: string
  like: number
  writer: AdminUserInfo
  comment: number
}

// 게시글에 연관된 내용들 가져오기
async function getRelatedInfo(
  boardUid: number,
  postUid: number,
  userUid: number,
): Promise<RelatedResults> {
  const [board] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [boardUid])
  const likeCount = await getPostLikeCount(postUid)
  const writer = await getUserBasic(userUid)
  const commentCount = await getTotalCommentCount(postUid)

  let result: RelatedResults = {
    id: board.id,
    like: likeCount,
    writer: writer as AdminUserInfo,
    comment: commentCount,
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
      writer: info.writer,
      comment: info.comment,
      hit: post.hit,
      status: post.status,
    })
  }
  return result
}

// 최신 글 정보 가져오기
export async function getPosts(
  page: number,
  bunch: number,
  maxUid: number,
): Promise<AdminLatestPost[]> {
  let result: AdminLatestPost[] = []
  const last = 1 + maxUid - (page - 1) * bunch
  const posts = await select(
    `SELECT uid, board_uid, user_uid, category_uid, title, content, submitted, hit, status FROM ${table}post WHERE uid < ? ORDER BY uid DESC LIMIT ?`,
    [last, bunch],
  )
  if (!posts[0]) {
    return result
  }
  result = await makePostResult(posts)
  return result
}

// 검색 결과 가져오기
export async function getSearchedPosts(search: AdminSearchCommon): Promise<AdminLatestPost[]> {
  let result: AdminLatestPost[] = []
  const last = 1 + search.maxUid - (search.page - 1) * search.bunch
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
