/**
 * install/found.env.ts
 *
 * 설치 진행에 필요한 유틸 함수들 모음
 */
const fs = require("fs")
import { foundEnv } from "./messages"

// .env 파일이 이미 있으면 설치 중단할지 물어보기
export function checkEnvFile(): void {
  if (fs.existsSync(".env")) {
    console.log(foundEnv)
    let cont = prompt("이미 설치된 것으로 보입니다. 그래도 계속 진행하시겠습니까? (yes/no)") ?? "no"
    cont = cont?.toLowerCase()
    if (cont !== "yes") {
      console.log(`\n\n설치를 중단합니다.\n재설치를 원하시면 먼저 .env 파일을 삭제해 보세요!\n`)
      process.exit(0)
    }
  }
}

// DBMS에 필요한 데이터베이스, 테이블 설치 직전 .env 파일 수정되었는지 확인
export function checkAfterModifyEnvFile(): void {
  let answer = prompt("위의 안내를 확인했으며 .env 파일 수정을 완료하셨나요? (yes/no)") ?? "no"
  answer = answer?.toLowerCase()
  if (answer !== "yes") {
    console.log(`\n\n설치를 종료합니다.\n다시 실행을 원하시면 bun install.ts 로 실행해 주세요!\n`)
    process.exit(0)
  }
}
