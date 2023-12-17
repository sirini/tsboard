/**
 * install/found.env.ts
 *
 * 설치 진행에 필요한 유틸 함수들 모음
 */
const fs = require("fs")
import mysql from "mysql2/promise"
import { tables, inserts } from "./table/query"
import { env, foundEnv } from "./messages"
import chalk from "chalk"
const log = console.log

// .env 파일이 이미 있으면 설치 중단할지 물어보기
export function checkEnvFile(): void {
  if (fs.existsSync(".env")) {
    log(foundEnv)
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
      log(`\n${chalk.red("설치를 중단")}합니다.\n`)
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
  socket: string
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
    socket: "",
  }
  while (cont) {
    console.log(`\n이제 데이터베이스 접속 정보를 하나씩 입력해 주세요!\n`)
    result.host = prompt(`DB 호스트명 입력 (기본 → ${chalk.yellow("localhost")}) :`) ?? "localhost"
    result.user = prompt(`DB 사용자명 입력 :`) ?? ""
    result.pass = prompt(`DB 비밀번호 입력 :`) ?? ""
    result.name = prompt(`DB 데이터베이스명 (기본 → tsboard) :`) ?? "tsboard"
    result.prefix =
      prompt(`테이블명의 앞머리 글자 지정 (기본 → ${chalk.yellow("tsb_")}) :`) ?? "tsb_"
    result.socket =
      prompt(`DB 소켓 경로 (기본 → ${chalk.yellow("/var/run/mysqld/myqsld.sock")}) :`) ?? ""

    const confirm = `\n입력하신 내용을 확인해 주세요.\n
    - DB 호스트명 : ${chalk.green.bold(result.host)}
    - DB 사용자명 : ${chalk.green.bold(result.user)}
    - DB 비밀번호 : ${chalk.green.bold(result.pass)}
    - DB 데이터베이스 이름 : ${chalk.green.bold(result.name)}
    - 테이블 앞머리 글자 : ${chalk.green.bold(result.prefix)}
    - mysqld.socket 경로 : ${chalk.green.bold(result.socket)}`
    log(confirm)
    const answer = prompt("\n위 내용이 확실한가요? (yes/no/retry) :")
    if (answer === "yes") {
      if (result.host === "" || result.user === "" || result.pass === "" || result.name === "") {
        log(`\n${chalk.red.bold("빈 칸으로 입력")}된 항목이 있습니다. 다시 입력해 주세요!`)
        continue
      } else {
        break
      }
    } else if (answer === "retry") {
      continue
    } else {
      result = {
        host: "",
        user: "",
        pass: "",
        name: "",
        prefix: "",
        socket: "",
      }
      break
    }
  }
  return result
}

// JWT 비밀 키값으로 사용할 랜덤 문자열 만들기
function generateJWTSecretKey(limit: number = 20): string {
  let result = ""
  const characters = Array.from(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^&*_+-=()[]{}<>",
  )
  for (let i = 0; i < limit; i++) {
    result += characters.at(Math.floor(Math.random() * characters.length))
  }
  return result
}

// .env 파일에 DB 접속 정보 저장하기
export function saveEnvFile(db: DBInfo): void {
  let uEnv = env.replace("#dbhost#", db.host)
  const jwtSecret = generateJWTSecretKey()
  uEnv = uEnv.replace("#dbuser#", db.user)
  uEnv = uEnv.replace("#dbpass#", db.pass)
  uEnv = uEnv.replace("#dbname#", db.name)
  uEnv = uEnv.replace("#dbprefix#", db.prefix)
  uEnv = uEnv.replace("#dbsock#", db.socket)
  uEnv = uEnv.replace("#jwtsecret#", jwtSecret)
  fs.writeFileSync(".env", uEnv)
}

// 데이터터베이스 및 테이블 추가하기 진행
export async function createDBTables(db: DBInfo): Promise<void> {
  const conn = await mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.pass,
    socketPath: db.socket,
  })
  await conn.execute(
    `CREATE DATABASE IF NOT EXISTS tsboard CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
  )

  const prefix = `${db.name}.${db.prefix}`
  for (const sql of tables) {
    const query = sql.replace("#db#", prefix)
    await conn.execute(query)
  }

  for (const sql of inserts) {
    const query = sql.replace("#db#", prefix)
    await conn.execute(query)
  }
}
