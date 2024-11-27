import request from '@/utils/request'

// 登录接口
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

// 登出
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/auth/user-info',
    method: 'get'
  })
}

// 检查数据库状态
export function checkDbStatus() {
  return request({
    url: '/api/check-db',
    method: 'get'
  })
}

// 测试数据库连接
export function testConnection(data) {
  return request({
    url: '/api/db/test-connection',
    method: 'post',
    data
  })
}

// 初始化数据库
export function initializeDb() {
  return request({
    url: '/api/db/initialize',
    method: 'post'
  })
} 