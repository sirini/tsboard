/**
 * server/database/pool.ts
 *
 * MySQL(Maria) DBMS CRUD 메소드
 */
import mysql, { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise"

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

export const table = process.env.DB_TABLE_PREFIX ?? "tsb_"

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
  } catch (e) {
    console.log(`[error/select] ${query} (${values.toString()})`)
  } finally {
    db.release()
  }
  return result
}

export async function update(query: string, values: (string | number)[]): Promise<void> {
  const db = await connection()
  try {
    await db.execute(query, values)
  } catch (e) {
    console.log(`[error/update] ${query} (${values.toString()})`)
  } finally {
    db.release()
  }
}

export async function insert(query: string, values: (string | number)[]): Promise<number> {
  let insertId = 0
  const db = await connection()
  try {
    const [rows] = await db.execute<ResultSetHeader>(query, values)
    insertId = rows.insertId
  } catch (e) {
    console.log(`[error/insert] ${query} (${values.toString()})`)
  } finally {
    db.release()
  }
  return insertId
}
