/**
 * server/database/home/list
 *
 * 첫화면 최신글 보기에 필요한 함수들
 */

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
export async function getLatestPost(sinceUid: number, bunch: number): Promise<void> {
  const posts = await select(
    `SELECT uid, board_uid, user_uid, category_uid, title, content, hit FROM ${table}post ... TODO`,
  ) // TODO
}
