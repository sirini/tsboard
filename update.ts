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
await execute(`CREATE TABLE ${table}exif (
uid INT UNSIGNED NOT NULL AUTO_INCREMENT,
file_uid INT UNSIGNED NOT NULL DEFAULT '0',
post_uid INT UNSIGNED NOT NULL DEFAULT '0',
make VARCHAR(20) NOT NULL DEFAULT '',
model VARCHAR(20) NOT NULL DEFAULT '',
aperture INT UNSIGNED NOT NULL DEFAULT '0',
iso INT UNSIGNED NOT NULL DEFAULT '0',
focal_length INT UNSIGNED NOT NULL DEFAULT '0',
exposure INT UNSIGNED NOT NULL DEFAULT '0',
width INT UNSIGNED NOT NULL DEFAULT '0',
height INT UNSIGNED NOT NULL DEFAULT '0',
date BIGINT UNSIGNED NOT NULL DEFAULT '0',
PRIMARY KEY(uid),
KEY (file_uid),
KEY (post_uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`)

console.log(`v0.8.22, done.`)

process.exit(0)
