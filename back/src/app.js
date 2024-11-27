require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./routes')

const app = express()

// 禁用 punycode 警告
process.removeAllListeners('warning')

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 根路由
app.get('/', (req, res) => {
  res.json({
    code: 200,
    message: 'Welcome to Student Management System API',
    version: '1.0.0'
  })
})

// API路由
app.use(routes)

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    code: 500,
    message: '服务器内部错误'
  })
})

//const HOST = '0.0.0.0'  // 修改为监听所有网络接口，而不是默认的 localhost
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app