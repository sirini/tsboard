/**
 * update
 *
 * TSBOARD 업데이트, 실행 시 bun 런타임 사용
 *
 * bun update.ts
 */

import { table, execute } from "./server/database/common"

// 0.8.2 >>> 0.8.4, file_thumbnail 테이블 생성
await execute(`CREATE TABLE IF NOT EXISTS ${table}file_thumbnail (
  uid INT UNSIGNED NOT NULL AUTO_INCREMENT,
  file_uid INT UNSIGNED NOT NULL DEFAULT '0',
  post_uid INT UNSIGNED NOT NULL DEFAULT '0',
  path VARCHAR(300) NOT NULL DEFAULT '',
  PRIMARY KEY (uid),
  KEY (file_uid),
  KEY (post_uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`)

console.log(`v0.8.2 >>> v0.8.4 update.`)

process.exit(0)
