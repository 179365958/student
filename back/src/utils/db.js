const { sql } = require('mssql')

let pool = null

const defaultConfig = {
  server: process.env.DB_SERVER || 'localhost',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD,
  database: 'StudentDB',
  options: {
    trustServerCertificate: true,
    enableArithAbort: true
  }
}

async function getConnection(config = defaultConfig) {
  if (pool) {
    return pool
  }
  
  try {
    pool = await new sql.ConnectionPool(config).connect()
    return pool
  } catch (error) {
    console.error('数据库连接失败:', error)
    throw error
  }
}

async function closeConnection() {
  if (pool) {
    await pool.close()
    pool = null
  }
}

module.exports = {
  getConnection,
  closeConnection,
  sql
}
