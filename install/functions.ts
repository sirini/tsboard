/**
 * install/found.env.ts
 *
 * 설치 진행에 필요한 유틸 함수들 모음
 */
const fs = require("fs")
import mysql, { ConnectionOptions } from "mysql2/promise"
import { tables, inserts } from "./table/query"
import { foundEnv } from "./messages"
import chalk from "chalk"

// .env 파일이 이미 있으면 설치 중단할지 물어보기
export function checkEnvFile(): void {
  if (fs.existsSync(".env")) {
    console.log(foundEnv)
    let cont =
      prompt(
        `${chalk.red.bold(
          "\n\n(((주의))) 이미 설치된 것으로 보입니다.",
        )}\n\n계속 진행할 경우 기존 ${chalk.yellow(
          ".env",
        )} 파일은 초기화 됩니다.\n그래도 계속 진행하시겠습니까? (yes/no)`,
      ) ?? "no"
    cont = cont?.toLowerCase()
    if (cont !== "yes") {
      console.log(`\n${chalk.red("설치를 중단")}합니다.\n`)
      process.exit(0)
    }
  }
}

export interface DBInfo {
  host: string
  user: string
  pass: string
  name: string
  prefix: string
}

// 데이터베이스 접속 정보 받기
export function getDatabaseInformation(): DBInfo {
  let cont = true
  let result: DBInfo = {
    host: "",
    user: "",
    pass: "",
    name: "",
    prefix: "",
  }
  while (cont) {
    console.log(`\n이제 데이터베이스 접속 정보를 하나씩 입력해 주세요!\n`)
    result.host = prompt(`DB 호스트명 입력 (기본 → ${chalk.yellow("localhost")}) :`) ?? "localhost"
    result.user = prompt(`DB 사용자명 입력 (예 → ${chalk.gray("root")}) :`) ?? "sirini"
    result.pass = prompt(`DB 비밀번호 입력 :`) ?? "geunyul2"
    result.name =
      prompt(`DB 데이터베이스명 입력 (기본 → ${chalk.yellow("tsboard")}) :`) ?? "tsboard"
    result.prefix =
      prompt(`테이블명의 앞머리 글자 지정 (기본 → ${chalk.yellow("tsb_")}) :`) ?? "tsb_"
    const confirm = `\n입력하신 내용을 확인해 주세요.\n
    - DB 호스트명 : ${chalk.green(result.host)}
    - DB 사용자명 : ${chalk.green(result.user)}
    - DB 비밀번호 : ${chalk.green(result.pass)}
    - DB 데이터베이스 이름 : ${chalk.green(result.name)}
    - 테이블 앞머리 글자 : ${chalk.green(result.prefix)}`
    console.log(confirm)
    const answer = prompt("\n위 내용이 확실한가요? (yes/no/retry) :")
    if (answer === "yes") {
      break
    } else if (answer === "retry") {
      continue
    } else {
      result = {
        host: "",
        user: "",
        pass: "",
        name: "",
        prefix: "",
      }
      break
    }
  }
  return result
}

// JWT 비밀 키값으로 사용할 랜덤 문자열 만들기
export function generateJWTSecretKey(limit: number = 20): string {
  let result = ""
  const characters = Array.from(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^&*()_+-=[]{}",
  )
  for (let i = 0; i < limit; i++) {
    result += characters.at(Math.floor(Math.random() * characters.length))
  }
  return result
}

// 데이터터베이스 및 테이블 추가하기 진행
export async function setup(db: DBInfo): Promise<void> {
  const access: ConnectionOptions = {
    host: db.host,
    user: db.user,
    password: db.pass,
  }
  const conn = await mysql.createConnection(access)
  await conn.execute(
    `CREATE DATABASE IF NOT EXISTS ${db.name} CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
  )

  const prefix = `${db.name}.${db.prefix}`

  // TODO - 테이블 생성 안되는 문제 수정 필요
  tables.map((sql) => {
    const query = sql.replace("#db#", prefix)
    conn.execute(query)
  })

  inserts.map((sql) => {
    const query = sql.replace("#db#", prefix)
    conn.execute(query)
  })

  conn.destroy()
}
