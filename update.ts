/**
 * update
 *
 * TSBOARD 업데이트, 실행 시 bun 런타임 사용
 *
 * bun update.ts
 */

import { saveThumbnailImage } from "./server/database/board/editor"
import { table, execute, select } from "./server/database/common"
import { removeEmptyDir, removeFile } from "./server/util/tools"

// 0.8.2 >>> 0.8.4, file_thumbnail 테이블 생성
// await execute(`CREATE TABLE IF NOT EXISTS ${table}file_thumbnail (
//   uid INT UNSIGNED NOT NULL AUTO_INCREMENT,
//   file_uid INT UNSIGNED NOT NULL DEFAULT '0',
//   post_uid INT UNSIGNED NOT NULL DEFAULT '0',
//   path VARCHAR(300) NOT NULL DEFAULT '',
//   PRIMARY KEY (uid),
//   KEY (file_uid),
//   KEY (post_uid)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`)

// 0.8.4 >>> 0.8.14, file_thumbnail 테이블에 full_path 컬럼 추가
// await execute(
//   `ALTER TABLE ${table}file_thumbnail ADD full_path VARCHAR(300) NOT NULL DEFAULT '' AFTER path`,
// )

// const thumbs = await select(`SELECT path FROM ${table}file_thumbnail`)
// for (const thumb of thumbs) {
//   await removeFile(`.${thumb.path}`)
//   console.log(`Remove file: .${thumb.path}`)
// }

// await execute(`TRUNCATE ${table}file_thumbnail`)
// console.log(`Truncate table: ${table}file_thumbnail`)

// await removeEmptyDir(`./upload/thumbnails`)
// console.log(`Empty directories have been removed: ./upload/thumbnails`)

// const files = await select(`SELECT uid, post_uid, path FROM ${table}file`)
// for (const file of files) {
//   if (/\.(jpg|jpeg|png|bmp|webp|gif|avif)$/i.test(file.path)) {
//     await saveThumbnailImage(file.uid, file.post_uid, `.${file.path}`)
//     console.log(`SAVED: .${file.path} for #${file.post_uid}`)
//   }
// }

// 0.8.14 >>> 0.8.18
// await execute(`ALTER TABLE ${table}board CHANGE \`row\` row_count TINYINT`)
// await execute(`ALTER TABLE ${table}user_token DROP COLUMN access`)
// await execute(`ALTER TABLE ${table}user_token DROP COLUMN timestamp_access`)
// await execute(`TRUNCATE ${table}user_token`)
// await execute(`ALTER TABLE ${table}user_token MODIFY COLUMN refresh CHAR(64) NOT NULL DEFAULT ''`)
// await execute(
//   `ALTER TABLE ${table}user_token CHANGE timestamp_refresh timestamp BIGINT UNSIGNED NOT NULL DEFAULT '0'`,
// )

// 0.8.18 >>> 0.8.22
// await execute(`CREATE TABLE ${table}exif (
// uid INT UNSIGNED NOT NULL AUTO_INCREMENT,
// file_uid INT UNSIGNED NOT NULL DEFAULT '0',
// post_uid INT UNSIGNED NOT NULL DEFAULT '0',
// make VARCHAR(20) NOT NULL DEFAULT '',
// model VARCHAR(20) NOT NULL DEFAULT '',
// aperture INT UNSIGNED NOT NULL DEFAULT '0',
// iso INT UNSIGNED NOT NULL DEFAULT '0',
// focal_length INT UNSIGNED NOT NULL DEFAULT '0',
// exposure INT UNSIGNED NOT NULL DEFAULT '0',
// width INT UNSIGNED NOT NULL DEFAULT '0',
// height INT UNSIGNED NOT NULL DEFAULT '0',
// date BIGINT UNSIGNED NOT NULL DEFAULT '0',
// PRIMARY KEY(uid),
// KEY (file_uid),
// KEY (post_uid)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`)

// 0.8.22 >>> 0.8.26
// await execute(`CREATE TABLE ${table}image_description (
// uid INT UNSIGNED NOT NULL AUTO_INCREMENT,
// file_uid INT UNSIGNED NOT NULL DEFAULT '0',
// post_uid INT UNSIGNED NOT NULL DEFAULT '0',
// description VARCHAR(500) NOT NULL DEFAULT '',
// PRIMARY KEY(uid),
// KEY (file_uid),
// KEY (post_uid)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`)

// 0.8.26 >>> 0.8.32
const _att = `ALTER TABLE ${table}`
const _ac = "ADD CONSTRAINT"
const _fk = "FOREIGN KEY"
const _rt = `REFERENCES ${table}`
await execute(`${_att}user_token ${_ac} fk_ut ${_fk} (user_uid) ${_rt}user(uid)`)
await execute(`${_att}user_permission ${_ac} fk_up ${_fk} (user_uid) ${_rt}user(uid)`)
await execute(`${_att}user_black_list ${_ac} fk_ubl ${_fk} (user_uid) ${_rt}user(uid)`)
await execute(`${_att}chat ${_ac} fk_ct ${_fk} (to_uid) ${_rt}user(uid)`)
await execute(`${_att}chat ${_ac} fk_cf ${_fk} (from_uid) ${_rt}user(uid)`)
await execute(`${_att}board_category ${_ac} fk_bc ${_fk} (board_uid) ${_rt}board(uid)`)
await execute(`${_att}point_history ${_ac} fk_ph ${_fk} (user_uid) ${_rt}user(uid)`)
await execute(`${_att}post ${_ac} fk_pb ${_fk} (board_uid) ${_rt}board(uid)`)
await execute(`${_att}post ${_ac} fk_pu ${_fk} (user_uid) ${_rt}user(uid)`)
await execute(`${_att}post ${_ac} fk_pc ${_fk} (category_uid) ${_rt}board_category(uid)`)
await execute(`${_att}post_hashtag ${_ac} fk_phb ${_fk} (board_uid) ${_rt}board(uid)`)
await execute(`${_att}post_hashtag ${_ac} fk_php ${_fk} (post_uid) ${_rt}post(uid)`)
await execute(`${_att}post_hashtag ${_ac} fk_phh ${_fk} (hashtag_uid) ${_rt}hashtag(uid)`)
await execute(`${_att}post_like ${_ac} fk_plp ${_fk} (post_uid) ${_rt}post(uid)`)
await execute(`${_att}post_like ${_ac} fk_plu ${_fk} (user_uid) ${_rt}user(uid)`)
await execute(`${_att}comment ${_ac} fk_cb ${_fk} (board_uid) ${_rt}board(uid)`)
await execute(`${_att}comment ${_ac} fk_cp ${_fk} (post_uid) ${_rt}post(uid)`)
await execute(`${_att}comment ${_ac} fk_cu ${_fk} (user_uid) ${_rt}user(uid)`)
await execute(`${_att}comment_like ${_ac} fk_clc ${_fk} (comment_uid) ${_rt}comment(uid)`)
await execute(`${_att}comment_like ${_ac} fk_clu ${_fk} (user_uid) ${_rt}user(uid)`)
await execute(`${_att}file ${_ac} fk_f ${_fk} (post_uid) ${_rt}post(uid)`)
await execute(`${_att}file_thumbnail ${_ac} fk_ftf ${_fk} (file_uid) ${_rt}file(uid)`)
await execute(`${_att}file_thumbnail ${_ac} fk_ftp ${_fk} (post_uid) ${_rt}post(uid)`)
await execute(`${_att}image ${_ac} fk_ib ${_fk} (board_uid) ${_rt}board(uid)`)
await execute(`${_att}image ${_ac} fk_iu ${_fk} (user_uid) ${_rt}user(uid)`)
await execute(`${_att}notification ${_ac} fk_nt ${_fk} (to_uid) ${_rt}user(uid)`)
await execute(`${_att}notification ${_ac} fk_nf ${_fk} (from_uid) ${_rt}user(uid)`)
await execute(`${_att}exif ${_ac} fk_ef ${_fk} (file_uid) ${_rt}file(uid)`)
await execute(`${_att}exif ${_ac} fk_ep  ${_fk} (post_uid) ${_rt}post(uid)`)
await execute(`${_att}image_description ${_ac} fk_idf ${_fk} (file_uid) ${_rt}file(uid)`)
await execute(`${_att}image_description ${_ac} fk_idp ${_fk} (post_uid) ${_rt}post(uid)`)

console.log(`v0.8.32, done.`)

process.exit(0)
