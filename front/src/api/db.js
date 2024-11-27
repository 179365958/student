import request from '@/utils/request'

// 检查数据库状态
export function checkDbStatus() {
    return request({
        url: '/api/db/status',
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
export function initializeDb(data) {
    return request({
        url: '/api/db/initialize',
        method: 'post',
        data
    })
} 