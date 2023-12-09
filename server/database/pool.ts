/**
 * server/database/pool.ts
 *
 * MySQL(Maria) DBMS의 연결 풀 설정
 */
const mysql = require("mysql2/promise")

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  socketPath: process.env.RELEASE == "dev" ? process.env.DB_SOCK_DEV : process.env.DB_SOCK_PROD,
})
