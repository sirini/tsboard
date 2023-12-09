/**
 * install.ts
 *
 * 이 파일은 최초 설치 시 단 한 번 실행 필요합니다.
 * 파일 실행은 Bun을 사용합니다. 아래 명령어를 참조하세요.
 * Git clone을 통해 내려받으신 tsboard 폴더로 이동 후,
 *
 * bun install.ts
 *
 * 라고 입력 하시면 실행 됩니다.
 */

const fs = require("fs")
import { checkEnvFile, checkAfterModifyEnvFile } from "./install/functions"
import { env, welcome, install } from "./install/messages"

checkEnvFile()
fs.writeFileSync(".env", env)
console.log(welcome)
checkAfterModifyEnvFile()
console.log(install)

import mysql, { ConnectionOptions } from "mysql2/promise"
import { tables } from "./install/table/query"

for (const table of tables) {
  console.log(table)
}

async function setup(): Promise<void> {
  const access: ConnectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  }
  const conn = await mysql.createConnection(access)
  await conn.execute(
    `CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATA} CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
  )
}

// setup()
