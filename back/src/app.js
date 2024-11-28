require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRouter = require('./routes/auth')
const studentsRouter = require('./routes/students')
const classesRouter = require('./routes/classes')
const dashboardRouter = require('./routes/dashboard')

const app = express()

// 中间件
app.use(cors({
  origin: function(origin, callback) {
    // 允许所有来源，生产环境建议配置具体的域名
    callback(null, true)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// 添加测试路由
app.get('/', (req, res) => {
  res.json({
    message: 'Server is running',
    time: new Date().toISOString(),
    routes: {
      auth: '/api/auth/*',
      students: '/api/students/*',
      classes: '/api/classes/*',
      dashboard: '/api/dashboard/*'
    }
  })
})

// 路由
app.use('/api/auth', authRouter)
app.use('/api/students', studentsRouter)
app.use('/api/classes', classesRouter)
app.use('/api/dashboard', dashboardRouter)

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({
    success: false,
    message: err.message || '服务器内部错误'
  })
})

// 启动服务
const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
====================================
  Server is running
  - Port: ${PORT}
  - Time: ${new Date().toISOString()}
  - Routes:
    * /api/auth/*
    * /api/students/*
    * /api/classes/*
    * /api/dashboard/*
====================================
  `)
})

module.exports = app