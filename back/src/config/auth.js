module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',  // 建议在生产环境中使用环境变量
  JWT_EXPIRES_IN: '24h',  // token 过期时间
  SALT_ROUNDS: 10  // bcrypt 加密轮数
}
