/**
 * install/table/query.ts
 *
 * 테이블 구조 정의 모음
 */
const create = "CREATE TABLE IF NOT EXISTS"
const nnd = "NOT NULL DEFAULT"
const nnd0 = `${nnd} '0'`
const nnde = `${nnd} ''`
const unnd = `UNSIGNED ${nnd}`
const unnd0 = `${unnd} '0'`
const uid = "uid INT UNSIGNED NOT NULL auto_increment"
const primary = "PRIMARY KEY (`uid`)"
const engineEncode = `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`

export const tables: string[] = []
export const inserts: string[] = []

///////////////////////////////////
// v0.8.0 Initial version of tables
// 사용자 기본 정보 테이블, blocked = 1 일 경우 차단된 사용자
tables.push(`${create} #db#user (
  ${uid},
  id VARCHAR(100) ${nnde},
  name VARCHAR(30) ${nnde},
  password CHAR(64) ${nnde},
  profile VARCHAR(300) ${nnde},
  level TINYINT ${unnd0},
  point INT ${unnd0},
  signature VARCHAR(300) ${nnde},
  signup BIGINT ${unnd0},
  signin BIGINT ${unnd0},
  blocked TINYINT ${unnd0},
  ${primary}
) ${engineEncode}`)

// 사용자 인증용 토근 관리 테이블
tables.push(`${create} #db#user_token (
  user_uid INT ${unnd0},
  access VARCHAR(300) ${nnde},
  refresh VARCHAR(100) ${nnde},
  timestamp_access BIGINT ${unnd0},
  timestamp_refresh BIGINT ${unnd0},
  KEY (user_uid)
) ${engineEncode}`)

// 사용자의 권한들은 1 = 차단 / 0 = 가능
tables.push(`${create} #db#user_permission (
  ${uid},
  user_uid INT ${unnd0},
  write_post TINYINT UNSIGNED ${nnd} '1',
  write_comment TINYINT UNSIGNED ${nnd} '1',
  note TINYINT UNSIGNED ${nnd} '1',
  report TINYINT UNSIGNED ${nnd} '1',
  ${primary},
  KEY (user_uid)
) ${engineEncode}`)

// 가입 시 사용자 인증용 테이블
tables.push(`${create} #db#user_verification (
  ${uid},
  email VARCHAR(100) ${nnde},
  code CHAR(6) ${nnde},
  timestamp BIGINT ${unnd0},
  ${primary}
) ${engineEncode}`)

// 사용자 접속 기록
tables.push(`${create} #db#user_access_log (
  ${uid},
  user_uid INT ${unnd0},
  timestamp BIGINT ${unnd0},
  ${primary}
) ${engineEncode}`)

// 신고 내역
tables.push(`${create} #db#report (
  ${uid},
  to_uid INT ${unnd0},
  from_uid INT ${unnd0},
  request VARCHAR(1000) ${nnde},
  response VARCHAR(1000) ${nnde},
  timestamp BIGINT ${unnd0},
  solved TINYINT ${unnd0},
  ${primary},
  KEY (solved)
) ${engineEncode}`)

// 쪽지 테이블
tables.push(`${create} #db#note (
  ${uid},
  to_uid INT ${unnd0},
  from_uid INT ${unnd0},
  note VARCHAR(1000) ${nnde},
  timestamp BIGINT ${unnd0},
  ${primary},
  KEY (to_uid),
  KEY (from_uid)
) ${engineEncode}`)

// 그룹 관리용 테이블
tables.push(`${create} #db#group (
  ${uid},
  id VARCHAR(30) ${nnde},
  admin_uid INT ${unnd0},
  timestamp BIGINT ${unnd0},
  ${primary}
) ${engineEncode}`)

// 게시판 관리용 테이블 (type = 0 게시판 / 1 갤러리 / 2 블로그(TBD))
tables.push(`${create} #db#board (
  ${uid},
  id VARCHAR(30) ${nnde},
  group_uid INT ${unnd0},
  admin_uid INT ${unnd0},
  type TINYINT ${nnd0},
  name VARCHAR(20) ${nnde},
  info VARCHAR(100) ${nnde},
  row TINYINT UNSIGNED ${nnd} '20',
  width INT UNSIGNED NOT NULL DEFAULT '1000',
  use_category TINYINT ${unnd0},
  level_list TINYINT ${unnd0},
  level_view TINYINT ${unnd0},
  level_write TINYINT ${unnd0},
  level_comment TINYINT ${unnd0},
  level_download TINYINT ${unnd0},
  point_view INT ${nnd0},
  point_write INT ${nnd0},
  point_comment INT ${nnd0},
  point_download INT ${nnd0},
  ${primary}
) ${engineEncode}`)

// 게시판별 카테고리들 관리 테이블
tables.push(`${create} #db#board_category (
  ${uid},
  board_uid INT ${unnd0},
  name VARCHAR(30) ${nnde},
  ${primary},
  KEY (board_uid)
) ${engineEncode}`)

// 포인트 사용 이력 보관 테이블 (action = 0 view / 1 write / 2 comment / 3 download)
tables.push(`${create} #db#point_history (
  ${uid},
  user_uid INT ${unnd0},
  board_uid INT ${unnd0},
  action TINYINT ${unnd0},
  point INT ${nnd0},
  ${primary},
  KEY (user_uid)
) ${engineEncode}`)

// 게시글 보관 테이블
tables.push(`${create} #db#post (
  ${uid},
  board_uid INT ${unnd0},
  user_uid INT ${unnd0},
  category_uid INT ${unnd0},
  title VARCHAR(300) ${nnde},
  content VARCHAR(10000) ${nnde},
  submitted BIGINT ${unnd0},
  modified BIGINT ${unnd0},
  hit INT ${unnd0},
  removed TINYINT ${unnd0},
  ${primary},
  KEY (board_uid),
  KEY (user_uid),
  KEY (category_uid),
  KEY (hit),
  KEY (removed)
) ${engineEncode}`)

// 게시글과 해시태그들의 연관성 정보 보관 테이블
tables.push(`${create} #db#post_hashtag (
  post_uid INT ${unnd0},
  hashtag_uid INT ${unnd0},
  KEY (post_uid),
  KEY (hashtag_uid)
) ${engineEncode}`)

// 해시태그 테이블
tables.push(`${create} #db#hashtag (
  ${uid},
  name VARCHAR(30) ${nnde},
  used INT ${unnd0},
  timestamp BIGINT ${unnd0},
  ${primary}
) ${engineEncode}`)

// 게시글에 대해 사용자마다 좋아요를 눌렀는지 상태 저장
tables.push(`${create} #db#post_like (
  post_uid INT ${unnd0},
  user_uid INT ${unnd0},
  liked TINYINT ${unnd0},
  timestamp BIGINT ${unnd0},
  KEY (post_uid),
  KEY (user_uid)
) ${engineEncode}`)

// 댓글 보관 테이블
tables.push(`${create} #db#comment (
  ${uid},
  reply_uid INT ${unnd0},
  post_uid INT ${unnd0},
  user_uid INT ${unnd0},
  content VARCHAR(1000) ${nnde},
  submitted BIGINT ${unnd0},
  modified BIGINT ${unnd0},
  ${primary},
  KEY (reply_uid),
  KEY (post_uid)
) ${engineEncode}`)

// 댓글에 대해 사용자마다 좋아요를 눌렀는지 상태 저장
tables.push(`${create} #db#comment_like (
  comment_uid INT ${unnd0},
  user_uid INT ${unnd0},
  liked TINYINT ${unnd0},
  timestamp BIGINT ${unnd0},
  KEY (comment_uid),
  KEY (user_uid)
) ${engineEncode}`)

// 파일 첨부하기 기능으로 추가한 파일 정보 보관하는 테이블
tables.push(`${create} #db#file (
  ${uid},
  post_uid INT ${unnd0},
  name VARCHAR(100) ${nnde},
  path VARCHAR(300) ${nnde},
  timestamp BIGINT ${unnd0},
  ${primary},
  KEY (post_uid)
) ${engineEncode}`)

// 본문 작성 시 이미지 첨부하기 기능으로 추가한 이미지 정보 보관하는 테이블, 이미지는 1000px 이하로 리사이즈 후 저장됨
tables.push(`${create} #db#image (
  ${uid},
  user_uid INT ${unnd0},
  path VARCHAR(300) ${nnde},
  timestamp BIGINT ${unnd0},
  ${primary},
  KEY (user_uid)
) ${engineEncode}`)

// 알림 정보 저장용 테이블, type = 0 like post / 1 like comment / 2 leave comment / 3 got a new note
tables.push(`${create} #db#notice (
  ${uid},
  to_uid INT ${unnd0},
  from_uid INT ${unnd0},
  type TINYINT ${unnd0},
  post_uid INT ${unnd0},
  comment_uid INT ${unnd0},
  checked TINYINT ${unnd0},
  timestamp BIGINT ${unnd0},
  ${primary},
  KEY (to_uid)
) ${engineEncode}`)

///////////////////////////////////////////
// v0.8.0 Initial version of insert queries

// 기본 그룹 생성하기 (삭제 불가)
inserts.push(`INSERT INTO #db#group (
  id, admin_uid, timestamp
) VALUES (
  'default', 1, ${Date.now()}
)`)

// 자유 게시판 생성하기 (삭제 가능)
inserts.push(`INSERT INTO #db#board (
  id, group_uid, admin_uid, type, name, info, row, width, use_category,
  level_list, level_view, level_write, level_comment, level_download,
  point_view, point_write, point_comment, point_download
) VALUES (
  'free', 1, 1, 0, '자유 게시판', '아무거나 자유롭게 써봅시다', 20, 1000, 1,
  0, 0, 0, 0, 0,
  0, 0, 0, 0
)`)

// 자유 게시판의 기본 카테고리
inserts.push(`INSERT INTO #db#board_category (
  board_uid, name
) VALUES (
  1, '일반'
)`)
inserts.push(`INSERT INTO #db#board_category (
  board_uid, name
) VALUES (
  1, '아무거나'
)`)
inserts.push(`INSERT INTO #db#board_category (
  board_uid, name
) VALUES (
  1, '질문답변'
)`)
inserts.push(`INSERT INTO #db#board_category (
  board_uid, name
) VALUES (
  1, '새소식'
)`)
