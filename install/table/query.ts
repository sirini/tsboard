/**
 * install/table/query.ts
 *
 * 테이블 구조 정의 모음
 */
import { prefix, nnd, uid, engineEncode, primary } from "./common"

export const tables: string[] = []

// ip 주소는 MySQL 내장 함수 INET_ATON() 이용, 숫자 형태로 저장한다
tables.push(`CREATE TABLE ${prefix}user (
  ${uid},
  id VARCHAR(100) ${nnd} '',
  name VARCHAR(10) ${nnd} '',
  password CHAR(64) ${nnd} '',
  token VARCHAR(300) ${nnd} '',
  signup BIGINT(14) UNSIGNED ${nnd} '0',
  signin BIGINT(14) UNSIGNED ${nnd} '0',
  profile VARCHAR(300) ${nnd} '',
  ip INT(11) UNSIGNED ${nnd} '0',
  ${primary}
) ${engineEncode}`)

// 사용자의 권한들은 1 = 가능 / 0 = 금지
tables.push(`CREATE TABLE ${prefix}user_permission (
  user_uid INT(11) UNSIGNED ${nnd} NOT NULL auto_increment,
  write TINYINT(1) UNSIGNED ${nnd} '1',
  note TINYINT(1) UNSIGNED ${nnd} '1',
  report TINYINT(1) UNSIGNED ${nnd} '1',
  login TINYINT(1) UNSIGNED ${nnd} '1',
  PRIMARY KEY (\`user_uid\`)
) ${engineEncode}`)
