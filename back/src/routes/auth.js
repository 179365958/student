const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { authenticateToken } = require('../middleware/auth')

// 登录路由
router.post('/login', authController.login)

// 注册路由
router.post('/register', authController.register)

// 获取用户信息（需要认证）
router.get('/user-info', authenticateToken, authController.getUserInfo)

// 修改密码（需要认证）
router.post('/change-password', authenticateToken, authController.changePassword)

// 添加测试路由
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth service is running'
  });
});

module.exports = router