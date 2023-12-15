/**
 * install.ts
 *
 * 이 파일은 최초 설치 시 단 한 번 실행 필요, 실행 시 bun 런타임 사용
 *
 * bun install.ts
 */

const fs = require("fs")
import {
  checkEnvFile,
  getDatabaseInformation,
  generateJWTSecretKey,
  setup,
} from "./install/functions"
import { env, welcome, install, complete } from "./install/messages"
import chalk from "chalk"

checkEnvFile()
console.log(welcome)

const db = getDatabaseInformation()
if (db.host === "" || db.user === "" || db.pass === "" || db.name === "") {
  console.log(
    `\n\n${chalk.red("설치를 중단")}합니다.\n\n${chalk.yellow(
      "bun install.ts",
    )} 를 다시 실행하여 DB 접속 정보를 넣어주세요!\n`,
  )
  process.exit(0)
}
const jwtSecret = generateJWTSecretKey()
let uEnv = env.replace("#dbhost#", db.host)
uEnv = uEnv.replace("#dbuser#", db.user)
uEnv = uEnv.replace("#dbpass#", db.pass)
uEnv = uEnv.replace("#dbname#", db.name)
uEnv = uEnv.replace("#dbprefix#", db.prefix)
uEnv = uEnv.replace("#jwtsecret#", jwtSecret)
fs.writeFileSync(".env", uEnv)

console.log(install)
await setup(db)

let message = complete.replace("#dbname#", db.name)
message = message.replace("#dbprefix#", db.prefix)
console.log(message)

process.exit(0)
