const fs = require('fs').promises
const path = require('path')
const { sql } = require('mssql')
const { getConnection } = require('../utils/db')

exports.initializeDb = async (req, res) => {
  const { server, user, password } = req.body
  
  try {
    // 1. 读取初始化SQL文件
    const initSqlPath = path.join(__dirname, '../config/init.sql')
    const sqlContent = await fs.readFile(initSqlPath, 'utf8')
    
    // 2. 先尝试连接到master数据库
    const config = {
      server,
      user,
      password,
      database: 'master',
      options: {
        trustServerCertificate: true,
        enableArithAbort: true
      }
    }
    
    // 3. 执行初始化SQL
    const pool = await new sql.ConnectionPool(config).connect()
    await pool.request().batch(sqlContent)
    
    // 4. 关闭连接
    await pool.close()
    
    res.json({
      success: true,
      message: '数据库初始化成功'
    })
  } catch (error) {
    console.error('初始化失败:', error)
    res.status(500).json({
      success: false,
      message: error.message || '初始化失败'
    })
  }
}
