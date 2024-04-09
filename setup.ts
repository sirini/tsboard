/**
 * setup
 *
 * 이 파일은 최초 설치 시 단 한 번 실행 필요, 실행 시 bun 런타임 사용
 *
 * bun setup.ts
 */

import { checkEnvFile, getSetupInformation, saveEnvFile, initDatabase } from "./install/functions"
import { welcome, install, complete } from "./install/messages"
import chalk from "chalk"

checkEnvFile()
console.log(welcome)

const info = getSetupInformation()
if (
  info.db.host === "" ||
  info.db.user === "" ||
  info.db.pass === "" ||
  info.db.name === "" ||
  info.admin.id === "" ||
  info.admin.pw === ""
) {
  console.log(
    `\n${chalk.red.bold("설치를 중단")}합니다.\n\n${chalk.bgBlack.blue.bold(
      "bun setup.ts",
    )} 를 다시 실행하여 DB 접속 정보를 넣어주세요!\n`,
  )
  process.exit(0)
}

saveEnvFile(info)
console.log(install)
const result = await initDatabase(info)
if (result === false) {
  process.exit(0)
}

let message = complete.replace("#dbname#", info.db.name)
message = message.replace("#dbprefix#", info.db.prefix)
console.log(message)

process.exit(0)
