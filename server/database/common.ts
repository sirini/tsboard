/**
 * server/database/pool.ts
 *
 * MySQL(Maria) DBMS CRUD용 함수들
 */
import mysql, { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise"

// MySQL(Maria) 연결하기 (외부에 노출되지 않음)
async function connection(): Promise<PoolConnection> {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    socketPath: process.env.DB_SOCK_PATH,
  })
  return pool.getConnection()
}

// 테이블 prefix
export const table = process.env.DB_TABLE_PREFIX ?? "tsb_"

// SELECT 쿼리 실행 후 결과 리턴
export async function select(
  query: string,
  values: (string | number)[] = [],
): Promise<RowDataPacket[]> {
  let result: RowDataPacket[] = []
  const db = await connection()
  try {
    const [rows] = await db.execute<RowDataPacket[]>(query, values)
    if (!rows[0]) {
      return result
    }
    result = rows
  } catch (e: any) {
    console.log(`[error/select] ${query} (${values.toString()})`)
  } finally {
    db.release()
  }
  return result
}

// UPDATE 쿼리 실행
export async function update(query: string, values: (string | number)[]): Promise<void> {
  const db = await connection()
  try {
    await db.execute(query, values)
  } catch (e: any) {
    console.log(`[error/update] ${query} (${values.toString()})`)
  } finally {
    db.release()
  }
}

// INSERT 쿼리 실행 후 insertId 리턴
export async function insert(query: string, values: (string | number)[]): Promise<number> {
  let insertId = 0
  const db = await connection()
  try {
    const [rows] = await db.execute<ResultSetHeader>(query, values)
    insertId = rows.insertId
  } catch (e: any) {
    console.log(`[error/insert] ${query} (${values.toString()})`)
  } finally {
    db.release()
  }
  return insertId
}
