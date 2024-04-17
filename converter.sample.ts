/**
 * converter.sample
 *
 * 운영중인 다른 프로그램에서 TSBOARD로 데이터를 이전하고자 할 때 참고할 수 있는 코드입니다.
 * 사용중인 기존 프로그램이 어떤 형태의 스키마를 가지는지에 따라 코드 수정이 많이 필요할 수 있습니다.
 * 아래 예제 코드들은 참조만 하시고, 실제 컨버터 제작에서는 DB 구조를 잘 고려하셔서 수정하세요.
 *
 * 참고로 아래 코드는 하나의 기존 게시판 혹은 블로그를 가정하고 있으며, 변환 후 저장되는 위치 역시
 * TSBOARD 설치 시 생성되는 free 게시판을 가리킵니다. (BOARD_UID = 1)
 * 만약 여러 개의 게시판들을 순차적으로 변환해야 할 경우, 먼저 아래 코드를 통해 하나의 게시판을 대상으로 진행하시고,
 * 이어서 TSBOARD 관리화면을 통해 미리 필요한 게시판/갤러리들을 생성한 후 이어서 컨버팅을 진행하세요.
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
const COMMENT_MODIFIED = 0 // 옮긴 후의 댓글 수정 시각
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

// 기존 게시글 테이블 >>> TSBOARD 게시글 테이블
// 기존 테이블이 아래처럼 구성되어 있다고 가정
// -------------------------------------------------------------------------------------------------------
// uid (int, primary) | user_uid (int) | subject (varchar) | content (varchar) | hit (int) | date (bigint)
// -------------------------------------------------------------------------------------------------------

const TARGET_POST = "post"
const POST_CATEGORY = 1 // 옮긴 후의 카테고리 번호
const POST_MODIFIED = 0 // 옮긴 후의 글 수정 시각
const POST_STATUS = CONTENT_STATUS.NORMAL // 옮긴 후의 글 상태값

await execute(`TRUNCATE ${table}post`) // TSBOARD 테이블 비우기

const posts = await select(`SELECT uid, user_uid, subject, content, hit, date FROM ${TARGET_POST}`)
for (const post of posts) {
  // 기존 게시글 내용이 HTML 형식이 아닐 경우 추가적으로 처리 필요합니다
  // let refineContent = "<p>"
  // refineContent += post.content.replaceAll("\n", "<br />")
  // refineContent += "</p>"
  await insert(
    `INSERT INTO ${table}post (uid, board_uid, user_uid, category_uid, title, content, submitted, modified, hit, status) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      post.uid,
      BOARD_UID,
      post.user_uid,
      POST_CATEGORY,
      post.subject,
      post.content,
      post.date,
      POST_MODIFIED,
      post.hit,
      POST_STATUS,
    ],
  )
}

// 기존의 게시글 & 해시태그 테이블 >>> TSBOARD 게시글 & 해시태그 테이블
// 기존 테이블이 아래처럼 구성되어 있다고 가정
// ----------------------------------
// post_uid (int) | hashtag_uid (int)
// ----------------------------------

const TARGET_POST_HASHTAG = "post_hashtag"

await execute(`TRUNCATE ${table}post_hashtag`) // TSBOARD 테이블 비우기

const postHashtags = await select(`SELECT post_uid, hashtag_uid FROM ${TARGET_POST_HASHTAG}`)
for (const ph of postHashtags) {
  await insert(
    `INSERT INTO ${table}post_hashtag (board_uid, post_uid, hashtag_uid) VALUES (?, ?, ?)`,
    [BOARD_UID, ph.post_uid, ph.hashtag_uid],
  )
}

// 기존의 좋아요 기록 테이블 >>> TSBOARD 좋아요 테이블
// 기존 테이블이 아래처럼 구성되어 있다고 가정
// ----------------------------------------------------
// post_uid (int) | user_uid (int) | is_liked (tinyint)
// ----------------------------------------------------

const TARGET_POST_LIKE = "post_like"

await execute(`TRUNCATE ${table}post_like`) // TSBOARD 테이블 비우기

const postLikes = await select(`SELECT post_uid, user_uid, is_liked FROM ${TARGET_POST_LIKE}`)
for (const pl of postLikes) {
  await insert(
    `INSERT INTO ${table}post_like (board_uid, post_uid, user_uid, liked, timestamp) 
  VALUES (?, ?, ?, ?, ?)`,
    [BOARD_UID, pl.post_uid, pl.user_uid, pl.is_liked, Date.now()],
  )
}

// 기존의 파일 테이블 >>> TSBOARD 파일, 썸네일 테이블
// 기존 테이블이 아래처럼 구성되어 있다고 가정
// ---------------------------------------------------------------------
// uid (int, primary) | post_uid (int) | name (varchar) | path (varchar)
// ---------------------------------------------------------------------

const TARGET_FILE = "file"

await execute(`TRUNCATE ${table}file`) // TSBOARD 테이블 비우기
await execute(`TRUNCATE ${table}file_thumbnail`) // TSBOARD 테이블 비우기

const savePath = await makeSavePath("attachments")
const files = await select(`SELECT post_uid, name, path FROM ${TARGET_FILE}`)
for (const file of files) {
  // const filepath = `/please/update/path/if/you/need/${file.path}` // 필요하면 이런식으로 수정하세요
  const filepath = file.path
  const ext = filepath.split(".").pop() || ""
  const newPath = `${savePath}/${nanoid()}.${ext}`
  await Bun.write(newPath, Bun.file(filepath))

  const fileUid = await insert(
    `INSERT INTO ${table}file (board_uid, post_uid, name, path, timestamp) 
  VALUES (?, ?, ?, ?, ?)`,
    [BOARD_UID, file.post_uid, file.name, newPath.slice(1), Date.now()],
  )

  if (/(jpg|jpeg|png|bmp|webp|gif|avif)/i.test(ext) === true) {
    await saveThumbnailImage(fileUid, file.post_uid, newPath)
  }
}

/**
 * 경우에 따라 해시태그를 사용하지 않거나, 좋아요 기능이 없는 프로그램에서 옮길 수도 있습니다.
 * 이럴 때는 위에서 소개드린 샘플 코드에 구애받지 마시고, 필요한 부분만 실행하시면 됩니다.
 * 기존 DB 스키마 구조를 잘 파악하신다면 데이터 복사는 어렵지 않습니다!
 *
 * 도움이 필요하실 땐 tsboard.dev 를 방문해보세요!
 */
