/**
 * server/routers/sync
 *
 * 다른 서버에 이 곳 TSBOARD 데이터 일부를 전달할 때 필요한 라우팅
 *
 * - 일반적인 상황에서는 사용되지 않습니다.
 * - 운영중이신 다른 서버에서 이 곳의 데이터를 주기적으로 수집하고자 할 때만 필요합니다.
 * - 데이터 수집을 위해선 .env 파일에 정의된 JWT_SECRET_KEY 값을 알아야만 가능합니다.
 *   즉, 불특정 외부 사용자는 애초에 이 경로에 접근할 수 없습니다.
 *
 *   ※ 수집 대상 : 글제목 / 글내용 / 첨부파일 / 게시판 ID / 게시글 번호 / 작성시간 / 작성자명
 */

import { Elysia, t } from "elysia"
import { table, select } from "../database/common"
import { success, fail } from "../util/tools"
import { SHA256 } from "crypto-js"
import { CONTENT_STATUS } from "../database/board/const"
import { nanoid } from "nanoid"

type SyncResult = {
  id: string
  no: number
  title: string
  content: string
  submitted: number
  name: string
  files: string[]
}

export const sync = new Elysia().get(
  "/sync",
  async ({ query: { key, limit } }) => {
    let result: SyncResult[] = []
    const envKey = SHA256(process.env.JWT_SECRET_KEY || nanoid()).toString()
    if (envKey !== key) {
      return fail("Unauthorized access.", result)
    }
    if (limit < 1 || limit > 100) {
      return fail("Invalid parameter.", result)
    }

    const posts = await select(
      `SELECT uid, board_uid, user_uid, title, content, submitted FROM ${table}post 
    WHERE status = ? ORDER BY uid DESC LIMIT ?`,
      [CONTENT_STATUS.NORMAL.toString(), limit.toString()],
    )
    if (!posts) {
      return fail("No posts.", result)
    }

    for (const post of posts) {
      const [board] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [
        post.board_uid,
      ])
      if (!board) {
        continue
      }

      const [writer] = await select(`SELECT name FROM ${table}user WHERE uid = ? LIMIT 1`, [
        post.user_uid,
      ])
      if (!writer) {
        continue
      }

      let files: string[] = []
      const attachments = await select(`SELECT path FROM ${table}file WHERE post_uid = ?`, [
        post.uid,
      ])
      for (const attachment of attachments) {
        files.push(attachment.path)
      }

      result.push({
        id: board.id,
        no: post.uid,
        title: post.title,
        content: post.content,
        submitted: post.submitted,
        name: writer.name,
        files,
      })
    }

    return success(result)
  },
  {
    query: t.Object({
      key: t.String(),
      limit: t.Numeric(),
    }),
  },
)
