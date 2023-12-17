/**
 * setup.ts
 *
 * 이 파일은 최초 설치 시 단 한 번 실행 필요, 실행 시 bun 런타임 사용
 *
 * bun setup.ts
 */

const fs = require("fs")
import {
  checkEnvFile,
  getDatabaseInformation,
  saveEnvFile,
  createDBTables,
} from "./install/functions"
import { welcome, install, complete } from "./install/messages"
import chalk from "chalk"

checkEnvFile()
console.log(welcome)

const db = getDatabaseInformation()
if (db.host === "" || db.user === "" || db.pass === "" || db.name === "") {
  console.log(
    `\n${chalk.red.bold("설치를 중단")}합니다.\n\n${chalk.bgBlack.blue.bold(
      "bun setup.ts",
    )} 를 다시 실행하여 DB 접속 정보를 넣어주세요!\n`,
  )
  process.exit(0)
}

saveEnvFile(db)
console.log(install)
await createDBTables(db)

let message = complete.replace("#dbname#", db.name)
message = message.replace("#dbprefix#", db.prefix)
console.log(message)

process.exit(0)
