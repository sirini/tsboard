/**
 * server/database/admin/latest/general/post
 *
 * 최신 글 톺아보기에서 게시글 가져오기 처리
 */

import { AdminLatestPost } from "../../../../../src/interface/admin"
import { select, table } from "../../../common"

// 최신 글 정보 가져오기
export async function getPosts(lastPostUid: number, bunch: number): Promise<AdminLatestPost[]> {
  let result: AdminLatestPost[] = []
  let last = lastPostUid
  if (last < 1) {
    const [total] = await select(`SELECT uid FROM ${table}post ORDER BY uid DESC LIMIT 1`)
    last = total.uid + 1
  }

  const posts = await select(
    `SELECT uid, board_uid, user_uid, category_uid, title, content, submitted, hit FROM ${table}post WHERE uid < ? ORDER BY uid DESC LIMIT ?`,
    [last, bunch],
  )
  if (!posts[0]) {
    return result
  }

  for (const post of posts) {
    const [like] = await select(
      `SELECT COUNT(*) AS total_count FROM ${table}post_like WHERE post_uid = ? AND liked = 1`,
      [post.uid],
    )
    const [writer] = await select(`SELECT name, profile FROM ${table}user WHERE uid = ? LIMIT 1`, [
      post.user_uid,
    ])
    const [comment] = await select(
      `SELECT COUNT(*) AS total_count FROM ${table}comment WHERE post_uid = ?`,
      [post.uid],
    )

    // TODO
  }

  return result
}
