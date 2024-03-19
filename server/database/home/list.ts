/**
 * server/database/home/list
 *
 * 첫화면 최신글 보기에 필요한 함수들
 */

import { BoardType } from "../../../src/interface/board"
import { PostItem } from "../../../src/interface/home"
import { table, select } from "../common"

// 가장 최신글의 고유 번호 가져오기
export async function getMaxUid(): Promise<number> {
  const [post] = await select(`SELECT MAX(uid) AS max_uid FROM ${table}post`)
  if (!post) {
    return 0
  }
  return post.max_uid
}

// 지정된 키 인덱스 이하의 최근 게시글들 가져오기
export async function getLatestPost(sinceUid: number, bunch: number): Promise<PostItem[]> {
  let result: PostItem[] = []
  const posts = await select(
    `SELECT uid, board_uid, user_uid, category_uid, title, content, hit FROM ${table}post 
    WHERE uid < ? ORDER BY uid DESC LIMIT ?`,
    [sinceUid, bunch],
  )

  for (const post of posts) {
    const [board] = await select(`SELECT id, type FROM ${table}board WHERE uid = ? LIMIT 1`, [
      post.board_uid,
    ])
    const [writer] = await select(`SELECT name, profile FROM ${table}user WHERE uid = ? LIMIT 1`, [
      post.user_uid,
    ])
    const [cat] = await select(`SELECT name FROM ${table}board_category WHERE uid = ? LIMIT 1`, [
      post.category_uid,
    ])
    const [like] = await select(
      `SELECT COUNT(*) AS total_count FROM ${table}post_like WHERE post_uid = ? AND liked = ?`,
      [post.uid, 1],
    )
    const [file] = await select(`SELECT path FROM ${table}file WHERE post_uid = ? LIMIT 1`, [
      post.uid,
    ])
    const cover = (file?.path as string) ?? ""

    result.push({
      uid: post.uid,
      id: board.id,
      type: board.type as BoardType,
      category: cat.name,
      title: post.title,
      content: post.content,
      cover,
      writer: {
        uid: post.user_uid,
        name: writer.name,
        profile: writer.profile,
      },
      hit: post.hit,
      like: like.total_count,
    })
  }

  return result
}
