const express = require('express')
const router = express.Router()
const sql = require('mssql')
const fs = require('fs').promises
const path = require('path')

// 检查数据库状态的路由
router.get('/check-db', async (req, res) => {
  try {
    // 从环境变量获取数据库配置
    const sqlConfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: 'master',    // 连接到 master 数据库来检查
      options: {
        encrypt: false,      // SQL Server 2005 不需要加密
        trustServerCertificate: true,
        instanceName: process.env.DB_INSTANCE
      }
    }

    // 连接到 SQL Server
    await sql.connect(sqlConfig)

    // 检查数据库是否存在
    const result = await sql.query`
      SELECT name 
      FROM master.dbo.sysdatabases 
      WHERE name = ${process.env.DB_DATABASE}
    `

    await sql.close()

    // 读取初始化 SQL 文件内容
    const initSqlPath = path.join(__dirname, '../config/init.sql')
    const initSqlContent = await fs.readFile(initSqlPath, 'utf8')

    res.json({
      success: true,
      exists: result.recordset.length > 0,
      message: result.recordset.length > 0 ? '数据库已存在' : '数据库不存在',
      sqlContent: result.recordset.length > 0 ? null : initSqlContent // 如果数据库不存在，返回初始化 SQL
    })

  } catch (error) {
    console.error('检查数据库状态失败:', error)
    res.status(500).json({
      success: false,
      exists: false,
      message: '检查数据库状态失败: ' + error.message
    })
  } finally {
    try {
      await sql.close()
    } catch (err) {
      console.error('关闭数据库连接失败:', err)
    }
  }
})

// 初始化数据库的路由
router.post('/init-db', async (req, res) => {
  try {
    const sqlConfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: 'master',  // 连接到 master 数据库
      options: {
        encrypt: false,
        trustServerCertificate: true,
        instanceName: process.env.DB_INSTANCE
      }
    }

    // 连接到 SQL Server
    await sql.connect(sqlConfig)

    // 读取初始化 SQL 文件
    const initSqlPath = path.join(__dirname, '../config/init.sql')
    const initSqlContent = await fs.readFile(initSqlPath, 'utf8')

    // 分割并执行 SQL 语句（按 GO 分割）
    const sqlStatements = initSqlContent.split(/\bGO\b/)
    
    // 逐个执行 SQL 语句
    for (const statement of sqlStatements) {
      if (statement.trim()) {
        try {
          await sql.query(statement)
        } catch (error) {
          console.error('执行 SQL 语句失败:', error)
          console.error('问题 SQL:', statement)
          throw error
        }
      }
    }

    res.json({
      success: true,
      message: '数据库初始化成功'
    })

  } catch (error) {
    console.error('数据库初始化失败:', error)
    res.status(500).json({
      success: false,
      message: '数据库初始化失败: ' + error.message
    })
  } finally {
    try {
      await sql.close()
    } catch (err) {
      console.error('关闭数据库连接失败:', err)
    }
  }
})

// 也添加一个 GET 方法的路由，用于获取初始化 SQL 内容
router.get('/init-db', async (req, res) => {
  try {
    const initSqlPath = path.join(__dirname, '../config/init.sql')
    const initSqlContent = await fs.readFile(initSqlPath, 'utf8')
    
    res.json({
      success: true,
      sqlContent: initSqlContent
    })
  } catch (error) {
    console.error('读取初始化 SQL 文件失败:', error)
    res.status(500).json({
      success: false,
      message: '读取初始化 SQL 文件失败: ' + error.message
    })
  }
})

module.exports = router 