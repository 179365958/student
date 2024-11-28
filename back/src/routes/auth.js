const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// 登录路由
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (username === 'admin' && password === '123456') {
      res.json({
        success: true,
        data: {
          token: 'test-token',
          username: 'admin',
          name: '管理员'
        }
      })
    } else {
      res.json({
        success: false,
        message: '用户名或密码错误'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || '登录失败'
    })
  }
})

module.exports = router 