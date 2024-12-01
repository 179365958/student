const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/auth');

class AuthController {
  // 登录
  async login(req, res) {
    try {
      const { username, password } = req.body;
      console.log('Login attempt for username:', username);

      // 验证用户
      const user = await User.findByUsername(username);
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('User not found');
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误'
        });
      }

      // 验证密码
      console.log('Verifying password...');
      const isValidPassword = await User.verifyPassword(password, user.Password);
      console.log('Password valid:', isValidPassword ? 'Yes' : 'No');
      
      if (!isValidPassword) {
        console.log('Invalid password');
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误'
        });
      }

      // 生成 JWT token
      console.log('Generating JWT token...');
      const token = jwt.sign(
        { 
          id: user.UserID,
          username: user.Username,
          role: user.Role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      console.log('Login successful');
      res.json({
        success: true,
        data: {
          token,
          username: user.Username,
          name: user.Name,
          role: user.Role
        }
      });
    } catch (error) {
      console.error('登录错误:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: '登录失败: ' + error.message
      });
    }
  }

  // 注册
  async register(req, res) {
    try {
      const { username, password, name } = req.body;

      // 检查用户是否已存在
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '用户名已存在'
        });
      }

      // 创建新用户
      await User.createUser({ username, password, name });

      res.status(201).json({
        success: true,
        message: '注册成功'
      });
    } catch (error) {
      console.error('注册错误:', error);
      res.status(500).json({
        success: false,
        message: '注册失败'
      });
    }
  }

  // 获取用户信息
  async getUserInfo(req, res) {
    try {
      const user = await User.findByUsername(req.user.username);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      res.json({
        success: true,
        data: {
          username: user.Username,
          name: user.Name,
          role: user.Role
        }
      });
    } catch (error) {
      console.error('获取用户信息错误:', error);
      res.status(500).json({
        success: false,
        message: '获取用户信息失败'
      });
    }
  }

  // 修改密码
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;

      // 获取用户信息
      const user = await User.findByUsername(req.user.username);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 验证旧密码
      const isValidPassword = await User.verifyPassword(oldPassword, user.Password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: '原密码错误'
        });
      }

      // 修改密码
      const updated = await User.changePassword(userId, newPassword);
      if (!updated) {
        return res.status(500).json({
          success: false,
          message: '密码修改失败'
        });
      }

      res.json({
        success: true,
        message: '密码修改成功'
      });
    } catch (error) {
      console.error('修改密码错误:', error);
      res.status(500).json({
        success: false,
        message: '密码修改失败'
      });
    }
  }
}

module.exports = new AuthController()