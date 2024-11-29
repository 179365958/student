import request from '@/utils/request'

// 获取班级列表
export function getClassList(params) {
  return request({
    url: '/api/classes',
    method: 'get',
    params
  })
}

// 创建班级
export function createClass(data) {
  return request({
    url: '/api/classes',
    method: 'post',
    data
  })
}

// 更新班级
export function updateClass(id, data) {
  return request({
    url: `/api/classes/${id}`,
    method: 'put',
    data
  })
}

// 删除班级
export function deleteClass(id) {
  return request({
    url: `/api/classes/${id}`,
    method: 'delete'
  })
} 