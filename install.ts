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
import { checkEnvFile, checkAfterModifyEnvFile, setup } from "./install/functions"
import { env, welcome, install, complete } from "./install/messages"

checkEnvFile()
fs.writeFileSync(".env", env)

console.log(welcome)

checkAfterModifyEnvFile()

console.log(install)

// setup()

console.log(complete)
