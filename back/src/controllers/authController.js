const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sql = require('mssql')
const { poolPromise } = require('../config/db')

class AuthController {
  // 登录
  async login(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        })
      }

      const { username, password } = req.body
      console.log('Login attempt:', { username, password })
      
      const pool = await poolPromise
      
      // 切换到 StudentDB
      await pool.request().query('USE StudentDB')
      
      // 使用正确的列名查询用户
      const result = await pool.request()
        .input('username', sql.NVarChar, username)
        .query('SELECT UserID, Username, Password, Role, Status FROM Users WHERE Username = @username')
      
      console.log('Database query result:', result.recordset)
      
      const user = result.recordset[0]
      
      if (!user || user.Status === 0) {  // 添加状态检查
        console.log('User not found or inactive')
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误'
        })
      }

      // 使用 MD5 加密输入的密码
      const md5Password = crypto
        .createHash('md5')
        .update(password)
        .digest('hex')
        
      console.log('Password comparison:', {
        inputPasswordMD5: md5Password,
        storedPassword: user.Password  // 注意这里使用大写的 Password
      })

      // 验证密码
      const isValidPassword = md5Password === user.Password  // 注意这里使用大写的 Password
      
      if (!isValidPassword) {
        console.log('Password mismatch')
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误'
        })
      }

      // 生成 token，使用正确的字段名
      const token = jwt.sign(
        { 
          id: user.UserID,
          username: user.Username,
          role: user.Role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      )

      // 返回用户信息和token
      res.json({
        success: true,
        data: {
          user: {
            id: user.UserID,
            username: user.Username,
            role: user.Role
          },
          token
        }
      })
    } catch (error) {
      console.error('登录失败:', error)
      res.status(500).json({
        success: false,
        message: '登录失败',
        error: error.message
      })
    }
  }
}

module.exports = new AuthController() 