/**
 * converter.sample
 *
 * 운영중인 다른 프로그램에서 TSBOARD로 데이터를 이전하고자 할 때 참고할 수 있는 코드입니다.
 * 사용중인 기존 프로그램이 어떤 형태의 스키마를 가지는지에 따라 코드 수정이 많이 필요할 수 있습니다.
 * 아래 예제 코드들은 참조만 하시고, 실제 컨버터 제작에서는 DB 구조를 잘 고려하셔서 수정하세요.
 *
 * 참고로 아래 코드는 하나의 기존 게시판 혹은 블로그를 가정하고 있으며, 변환 후 저장되는 위치 역시
 * TSBOARD 설치 시 생성되는 free 게시판을 가리킵니다. 만약 여러 개의 게시판들을 순차적으로
 * 변환해야 할 경우, 먼저 아래 코드를 통해 하나의 게시판을 대상으로 진행하시고, 이어서
 * TSBOARD 관리화면을 통해 미리 필요한 게시판/갤러리들을 생성한 후 이어서 컨버팅을 진행하세요.
 *
 * 하다가 막힐 땐? tsboard.dev 방문!
 */

import { nanoid } from "nanoid"
import { table, select, insert, execute, update } from "./server/database/common"
import { makeSavePath } from "./server/util/tools"
import { saveThumbnailImage } from "./server/database/board/editor"
import { CONTENT_STATUS } from "./src/interface/board"

const BOARD_UID = 1 // TSBOARD 설치 시 생성되는 free 를 가리킵니다.

// 기존 사용자 테이블 >>> TSBOARD 사용자 테이블
// 기존 테이블이 아래처럼 구성되어 있다고 가정
// -------------------------------------------------------------------------------------------
// uid (int, primary) | id (varchar) | name (varchar) | password (char) | last_login (bigint)
// -------------------------------------------------------------------------------------------

const TARGET_USER = "user" // 기존 사용자 테이블명입니다.
const USER_PROFILE = "" // 옮겨진 후 사용자의 프로필 사진 경로입니다.
const USER_LEVEL = 1 // 옮겨진 후 사용자의 레벨입니다.
const USER_POINT = 100 // 옮겨진 후 사용자의 포인트입니다.
const SIGNATURE = "" // 옮겨진 후 사용자의 서명입니다.

await execute(`TRUNCATE ${table}user`) // TSBOARD 테이블 비우기

const users = await select(`SELECT uid, id, name, password, last_login FROM ${TARGET_USER}`)
for (const user of users) {
  await insert(
    `INSERT INTO ${table}user (uid, id, name, password, profile, level, point, signature, signin, blocked) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.uid,
      user.id,
      user.name,
      user.password,
      USER_PROFILE,
      USER_LEVEL,
      USER_POINT,
      SIGNATURE,
      user.last_login,
      0,
    ],
  )
}

// 기존 해시태그 테이블 >>> TSBOARD 해시태그 테이블
// 기존 테이블이 아래처럼 구성되어 있다고 가정
// --------------------------------------------------
// uid (int, primary) | name (varchar) | count (int)
// --------------------------------------------------

const TARGET_HASHTAG = "hashtag" // 기존 해시태그 테이블명입니다.

await execute(`TRUNCATE ${table}hashtag`) // TSBOARD 테이블 비우기

const hashtags = await select(`SELECT name, count FROM ${TARGET_HASHTAG}`)
for (const hashtag of hashtags) {
  await insert(`INSERT INTO ${table}hashtag (name, used, timestamp) VALUES (?, ?, ?)`, [
    hashtag.name,
    hashtag.count,
    Date.now(),
  ])
}

// 기존 댓글 테이블 >>> TSBOARD 댓글 테이블
// 기존 테이블이 아래처럼 구성되어 있다고 가정
// ---------------------------------------------------------------------------------------------
// uid (int, primary) | post_uid (int) | user_uid (int) | content (varchar) | timestamp (bigint)
// ---------------------------------------------------------------------------------------------

const TARGET_COMMENT = "comment"
const COMMENT_MODIFIED = 0 // 옮긴 후의 글 수정 시각
const COMMENT_STATUS = CONTENT_STATUS.NORMAL // 옮긴 후의 댓글 상태값

await execute(`TRUNCATE ${table}comment`) // TSBOARD 테이블 비우기

const comments = await select(
  `SELECT uid, post_uid, user_uid, content, timestamp FROM ${TARGET_COMMENT}`,
)
for (const comment of comments) {
  const insertUid = await insert(
    `INSERT INTO ${table}comment (uid, reply_uid, board_uid, post_uid, user_uid, content, submitted, modified, status) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      comment.uid,
      0,
      BOARD_UID,
      comment.post_uid,
      comment.user_uid,
      comment.comment,
      comment.timestamp,
      COMMENT_MODIFIED,
      COMMENT_STATUS,
    ],
  )

  // 모든 댓글은 답글이 없는 걸로 가정
  await update(`UPDATE ${table}comment SET reply_uid = ? WHERE uid = ? LIMIT 1`, [
    insertUid,
    insertUid,
  ])
}

// 계속 업데이트 예정 ...