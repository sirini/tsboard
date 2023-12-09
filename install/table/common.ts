/**
 * install/table/common.ts
 *
 * 테이블 생성 시 자주 쓰이는 SQL문 모음 (타이핑을 줄이는 목적 ㅎㅎ)
 */
export const prefix = process.env.DB_TABLE_PREFIX ?? "tsb_"
export const nnd = "NOT NULL DEFAULT"
export const uid = "uid INT(11) UNSIGNED NOT NULL auto_increment"
export const primary = "PRIMARY KEY (`uid`)"
export const engineEncode = `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`
