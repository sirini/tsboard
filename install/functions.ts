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
}

export interface SetupInfo {
  db: DBInfo
  admin: {
    id: string
    pw: string
  }
}

// 데이터베이스 접속 정보 받기
export function getSetupInformation(): SetupInfo {
  let cont = true
  let db: DBInfo = {
    host: "",
    user: "",
    pass: "",
    name: "",
    prefix: "",
  }
  let admin = {
    id: "",
    pw: "",
  }

  while (cont) {
    log(`\n이제 데이터베이스 접속 정보를 하나씩 입력해 주세요!\n`)
    db.host = prompt(`DB 호스트명 입력 (기본 → ${chalk.yellow("localhost")}) :`) ?? "localhost"
    db.user = prompt(`DB 사용자명 입력 :`) ?? ""
    db.pass = prompt(`DB 비밀번호 입력 :`) ?? ""
    db.name = prompt(`DB 데이터베이스명 (기본 → ${chalk.yellow("tsboard")}) :`) ?? "tsboard"
    db.prefix = prompt(`테이블명의 앞머리 글자 지정 (기본 → ${chalk.yellow("tsb_")}) :`) ?? "tsb_"

    log(`\n다음으로, 관리자 아이디(이메일)와 비밀번호를 입력해 주세요!\n`)
    admin.id =
      prompt(`관리자 아이디 입력 (기본 → ${chalk.yellow("admin@tsboard.dev")}) :`) ??
      "admin@tsboard.dev"
    admin.pw = prompt(`관리자 비밀번호 입력 :`) ?? ""

    const confirm = `\n입력하신 내용을 확인해 주세요.\n
    [데이터베이스]
    - DB 호스트명 : ${chalk.green.bold(db.host)}
    - DB 사용자명 : ${chalk.green.bold(db.user)}
    - DB 비밀번호 : ${chalk.green.bold(db.pass)}
    - DB 데이터베이스 이름 : ${chalk.green.bold(db.name)}
    - 테이블 앞머리 글자 : ${chalk.green.bold(db.prefix)}
    
    [관리자]
    - 아이디(이메일) : ${chalk.green.bold(admin.id)}
    - 비밀번호 : ${chalk.green.bold(admin.pw)}
    `
    log(confirm)
    const answer = prompt("\n위 내용이 확실한가요? (yes/no/retry) :")
    if (answer === "yes") {
      if (
        db.host === "" ||
        db.user === "" ||
        db.pass === "" ||
        db.name === "" ||
        admin.id === "" ||
        admin.pw === ""
      ) {
        log(`\n${chalk.red.bold("빈 칸으로 입력")}된 항목이 있습니다. 다시 입력해 주세요!`)
        continue
      } else {
        break
      }
    } else if (answer === "retry") {
      continue
    } else {
      db = {
        host: "",
        user: "",
        pass: "",
        name: "",
        prefix: "",
      }
      admin = {
        id: "",
        pw: "",
      }
      break
    }
  }
  return {
    db,
    admin,
  }
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
export function saveEnvFile(info: SetupInfo): void {
  let uEnv = env.replace("#dbhost#", info.db.host)
  const jwtSecret = generateJWTSecretKey()

  uEnv = uEnv.replace("#dbuser#", info.db.user)
  uEnv = uEnv.replace("#dbpass#", info.db.pass)
  uEnv = uEnv.replace("#dbname#", info.db.name)
  uEnv = uEnv.replace("#dbprefix#", info.db.prefix)
  uEnv = uEnv.replace("#jwtsecret#", jwtSecret)
  uEnv = uEnv.replace("#adminid#", info.admin.id)
  uEnv = uEnv.replace("#adminpw#", info.admin.pw)

  fs.writeFileSync(".env", uEnv)
}

// 데이터터베이스 및 테이블 추가하기 진행
export async function initDatabase(info: SetupInfo): Promise<void> {
  const conn = await mysql.createConnection({
    host: info.db.host,
    user: info.db.user,
    password: info.db.pass,
  })
  await conn.execute(
    `CREATE DATABASE IF NOT EXISTS tsboard CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
  )

  const prefix = `${info.db.name}.${info.db.prefix}`
  for (const sql of tables) {
    const query = sql.replace("#db#", prefix)
    await conn.execute(query)
  }

  for (const sql of inserts) {
    const query = sql.replace("#db#", prefix)
    await conn.execute(query)
  }

  // 관리자 초기 로그인 정보 등록하기
  await conn.execute(`INSERT INTO ${prefix}user (id, name, password, profile, level, point, signature, signup, signin, blocked) 
  VALUES ('${info.admin.id}', 'Admin', SHA2('${
    info.admin.pw
  }', 256), '', 9, 0, '', ${Date.now()}, 0, 0)`)
}
