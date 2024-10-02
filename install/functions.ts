/**
 * install/found.env.ts
 *
 * 설치 진행에 필요한 유틸 함수들 모음
 */
const fs = require("fs")
import chalk from "chalk"
import mysql from "mysql2/promise"
import { env, foundEnv } from "./messages"
import { inserts, tables } from "./table/query"
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

export type DBInfo = {
  host: string
  user: string
  pass: string
  name: string
  prefix: string
  sock: string
}

export type SetupInfo = {
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
    sock: "",
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
    db.sock =
      prompt(`mysqld.sock 파일 경로 (기본 → ${chalk.yellow("/var/run/mysqld/mysqld.sock")}) :`) ??
      "/var/run/mysqld/mysqld.sock"

    log(`\n다음으로, 관리자 아이디(이메일)와 비밀번호를 입력해 주세요!\n`)
    admin.id =
      prompt(`관리자 아이디 입력 (기본 → ${chalk.yellow("admin@tsboard.dev")}) :`) ??
      "admin@tsboard.dev"
    admin.pw = prompt(`관리자 비밀번호 입력 :`) ?? ""

    log(`\n입력하신 내용을 확인해 주세요.\n\n${chalk.bgBlack.bold("[데이터베이스]")}\n`)
    console.table(db)
    log(`\n${chalk.bgBlack.bold("[관리자]")}\n`)
    console.table(admin)

    const answer = prompt("\n위 내용이 확실한가요? (yes/no/retry) :")
    if (answer === "yes") {
      if (
        db.host === "" ||
        db.user === "" ||
        db.pass === "" ||
        db.name === "" ||
        db.sock === "" ||
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
        sock: "",
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
  uEnv = uEnv.replace("#dbsock#", info.db.sock)
  uEnv = uEnv.replace("#jwtsecret#", jwtSecret)
  uEnv = uEnv.replace("#adminid#", info.admin.id)
  uEnv = uEnv.replace("#adminpw#", info.admin.pw)

  fs.writeFileSync(".env", uEnv)
}

// 데이터터베이스 및 테이블 추가하기 진행
export async function initDatabase(info: SetupInfo): Promise<boolean> {
  let conn: any = null
  try {
    conn = await mysql.createConnection({
      host: info.db.host,
      user: info.db.user,
      password: info.db.pass,
      socketPath: info.db.sock,
    })
  } catch (e) {
    console.table(info.db)
    log(chalk.red.bold("데이터베이스에 연결할 수 없었습니다. 설치를 중단합니다..."))
    log(
      `MySQL(MariaDB) 접속 정보를 다시 확인하셔서 ${chalk.blue.bold(
        "bun setup.ts",
      )} 를 실행해 주세요!`,
    )
    log(`\n\n[DEBUG] Error: ${e}\n\n`)
    return false
  }
  await conn.execute(
    `CREATE DATABASE IF NOT EXISTS ${info.db.name} CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
  )

  const prefix = `${info.db.name}.${info.db.prefix}`
  for (const sql of tables) {
    const query = sql.replaceAll("#db#", prefix)
    await conn.execute(query)
  }

  for (const sql of inserts) {
    const query = sql.replaceAll("#db#", prefix)
    await conn.execute(query)
  }

  // 관리자 초기 로그인 정보 등록하기
  await conn.execute(
    `UPDATE ${prefix}user SET id = '${info.admin.id}', password = SHA2('${
      info.admin.pw
    }', 256), signup = ${Date.now()} WHERE uid = 1 LIMIT 1`,
  )

  return true
}
