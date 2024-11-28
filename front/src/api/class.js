import request from '@/utils/request'

// 获取班级列表
export function getClassList(params) {
  return request({
    url: '/api/classes',
    method: 'get',
    params
  })
} 